import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
const prisma = new PrismaClient();

interface CursorInfo {
  userId: number;
  position: number;
}

interface RoomState {
  users: Record<
    string,
    { userId: number; caret: { start: number; end: number } }
  >; // socketId -> info
}

/**
 * WebSocket Gateway для совместного редактирования заметки.
 *
 * События:
 * - join: { noteId } — войти в комнату заметки (авторизация по JWT через query token)
 * - leave: { noteId } — покинуть комнату
 * - caret: { noteId, caret: { start, end } } — обновить позицию caret пользователя
 * - edit: { noteId, content } — отправить изменение текста заметки
 *
 * Сервер отправляет:
 * - users: [{ userId, caret }] — список пользователей и их caret в комнате
 * - edit: { userId, content } — изменения от других пользователей
 * - error: string — ошибка авторизации или доступа
 */
@WebSocketGateway({ cors: { origin: "*", credentials: true } })
export class NotesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // roomId (noteId) -> RoomState
  private rooms: Record<string, RoomState> = {};

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(socket: Socket) {
    console.log("handleConnection", socket.id);
    const token = socket.handshake.query.token as string;
    if (!token) {
      socket.emit("auth", "Нет токена");
      socket.disconnect();
      return;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log("JWT payload:", payload);
      socket.data.userId = payload.sub;
      socket.emit("auth", "Авторизация успешна");
    } catch (e) {
      console.error("JWT verification failed:", e);
      socket.emit("error", "Неверный токен");
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    console.log("handleDisconnect", socket.id);
    // Удаляем пользователя из всех комнат
    for (const roomId in this.rooms) {
      if (this.rooms[roomId].users[socket.id]) {
        delete this.rooms[roomId].users[socket.id];
        // Уведомляем остальных пользователей
        socket.to(roomId).emit("users", this.getUsersInRoom(roomId));
      }
    }
  }

  /**
   * Войти в комнату заметки
   * @param data { noteId }
   * @param socket Socket
   */
  @SubscribeMessage("join")
  async handleJoin(
    @MessageBody() data: { noteId: number },
    @ConnectedSocket() socket: Socket
  ) {
    const roomId = String(data.noteId);
    const userId = socket.data.userId;

    console.log(`User ${userId} (socket ${socket.id}) joining room ${roomId}`);

    // Проверка доступа
    try {
      const note = await prisma.note.findUnique({
        where: { id: data.noteId },
        include: { collaborators: true },
      });

      if (
        !note ||
        (note.userId !== userId &&
          !note.collaborators.some((c) => c.userId === userId))
      ) {
        console.error("Нет доступа к заметке");
        socket.emit("error", "Нет доступа к заметке");
        return;
      }
    } catch (error) {
      console.error("Database error:", error);
      socket.emit("error", "Ошибка проверки доступа");
      return;
    }

    // Присоединяемся к комнате Socket.IO
    await socket.join(roomId);

    // Инициализируем комнату если её нет
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = { users: {} };
    }

    // Добавляем пользователя в комнату
    this.rooms[roomId].users[socket.id] = {
      userId,
      caret: { start: 0, end: 0 },
    };

    // Отправляем список пользователей всем в комнате
    const users = this.getUsersInRoom(roomId);
    this.server.to(roomId).emit("users", users);

    console.log(
      `User ${userId} joined room ${roomId}. Total users: ${users.length}`
    );
  }

  /**
   * Покинуть комнату заметки
   * @param data { noteId }
   * @param socket Socket
   */
  @SubscribeMessage("leave")
  handleLeave(
    @MessageBody() data: { noteId: number },
    @ConnectedSocket() socket: Socket
  ) {
    const roomId = String(data.noteId);
    const userId = socket.data.userId;

    console.log(`User ${userId} (socket ${socket.id}) leaving room ${roomId}`);

    // Покидаем комнату Socket.IO
    socket.leave(roomId);

    // Удаляем пользователя из нашей структуры
    if (this.rooms[roomId]) {
      delete this.rooms[roomId].users[socket.id];

      // Если комната пуста, удаляем её
      if (Object.keys(this.rooms[roomId].users).length === 0) {
        delete this.rooms[roomId];
      } else {
        // Уведомляем остальных пользователей
        const users = this.getUsersInRoom(roomId);
        this.server.to(roomId).emit("users", users);
      }
    }
  }

  /**
   * Обновить caret пользователя
   * @param data { noteId, caret: { start, end } }
   * @param socket Socket
   */
  @SubscribeMessage("caret")
  handleCaret(
    @MessageBody()
    data: { noteId: number; caret: { start: number; end: number } },
    @ConnectedSocket() socket: Socket
  ) {
    const roomId = String(data.noteId);
    const userId = socket.data.userId;

    if (this.rooms[roomId] && this.rooms[roomId].users[socket.id]) {
      this.rooms[roomId].users[socket.id].caret = data.caret;

      // Отправляем обновленный список пользователей всем в комнате
      const users = this.getUsersInRoom(roomId);
      this.server.to(roomId).emit("users", users);
    }
  }

  /**
   * Отправить изменение текста заметки
   * @param data { noteId, content }
   * @param socket Socket
   */
  @SubscribeMessage("edit")
  handleEdit(
    @MessageBody() data: { noteId: number; content: string },
    @ConnectedSocket() socket: Socket
  ) {
    const roomId = String(data.noteId);
    const userId = socket.data.userId;

    console.log(
      `Edit from user ${userId} in room ${roomId}: ${data.content.substring(0, 50)}...`
    );

    // Broadcast всем в комнате, кроме отправителя
    socket.to(roomId).emit("edit", { userId, content: data.content });
  }

  /**
   * Получить список пользователей в комнате
   * @param roomId string
   * @returns User[]
   */
  private getUsersInRoom(roomId: string) {
    if (!this.rooms[roomId]) {
      return [];
    }

    return Object.values(this.rooms[roomId].users).map((u) => ({
      userId: u.userId,
      caret: u.caret,
    }));
  }
}
