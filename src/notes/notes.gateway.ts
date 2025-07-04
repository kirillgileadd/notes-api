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
    console.log("handleConnection");
    const token = socket.handshake.query.token as string;
    if (!token) {
      socket.emit("auth", "Нет токена");
      socket.disconnect();
      return;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log(payload);
      socket.data.userId = payload.sub;
    } catch (e) {
      socket.emit("error", "Неверный токен");
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    for (const roomId in this.rooms) {
      if (this.rooms[roomId].users[socket.id]) {
        delete this.rooms[roomId].users[socket.id];
        this.broadcastUsers(roomId);
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
    // Проверка доступа
    const note = await prisma.note.findUnique({
      where: { id: data.noteId },
      include: { collaborators: true },
    });
    if (
      !note ||
      (note.userId !== userId &&
        !note.collaborators.some((c) => c.userId === userId))
    ) {
      socket.emit("error", "Нет доступа к заметке");
      socket.disconnect();
      return;
    }
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = { users: {} };
    }
    this.rooms[roomId].users[socket.id] = {
      userId,
      caret: { start: 0, end: 0 },
    };
    this.broadcastUsers(roomId);
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
    socket.leave(roomId);
    if (this.rooms[roomId]) {
      delete this.rooms[roomId].users[socket.id];
      this.broadcastUsers(roomId);
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
      this.broadcastUsers(roomId);
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
    // Broadcast всем, кроме отправителя
    socket.to(roomId).emit("edit", { userId, content: data.content });
  }

  /**
   * Отправить всем пользователям комнаты список пользователей и их caret
   * @param roomId string
   */
  private broadcastUsers(roomId: string) {
    const users = Object.values(this.rooms[roomId]?.users || {}).map((u) => ({
      userId: u.userId,
      caret: u.caret,
    }));
    this.server.to(roomId).emit("users", users);
  }
}
