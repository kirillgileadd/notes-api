import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { randomUUID } from "crypto";

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId,
        ...(dto.deadline ? { deadline: new Date(dto.deadline) } : {}),
      },
      include: { tags: true },
    });
  }

  async findAll(
    userId: number,
    filter?: {
      from?: string;
      to?: string;
      search?: string;
      sort?: "asc" | "desc";
      tags?: number[];
    }
  ) {
    const where: any = { userId, archived: false };
    if (filter?.from || filter?.to) {
      where.createdAt = {};
      if (filter.from) where.createdAt.gte = new Date(filter.from);
      if (filter.to) where.createdAt.lte = new Date(filter.to);
    }
    if (filter?.search) {
      where.title = { contains: filter.search, mode: "insensitive" };
    }
    if (filter?.tags && filter.tags.length > 0) {
      where.tags = { some: { id: { in: filter.tags } } };
    }
    return this.prisma.note.findMany({
      where,
      orderBy: { createdAt: filter?.sort || "desc" },
      include: { tags: true },
    });
  }

  async findArchived(
    userId: number,
    filter?: {
      from?: string;
      to?: string;
      search?: string;
      sort?: "asc" | "desc";
      tags?: number[];
    }
  ) {
    console.log("findArchived", userId, filter);
    const where: any = { userId, archived: true };
    if (filter?.from || filter?.to) {
      where.createdAt = {};
      if (filter.from) where.createdAt.gte = new Date(filter.from);
      if (filter.to) where.createdAt.lte = new Date(filter.to);
    }
    if (filter?.search) {
      where.title = { contains: filter.search, mode: "insensitive" };
    }
    if (filter?.tags && filter.tags.length > 0) {
      where.tags = { some: { id: { in: filter.tags } } };
    }
    return this.prisma.note.findMany({
      where,
      orderBy: { createdAt: filter?.sort || "desc" },
      include: { tags: true },
    });
  }

  private async checkAccess(userId: number, noteId: number) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: { collaborators: true },
    });
    if (!note) throw new NotFoundException("Заметка не найдена");
    if (
      note.userId !== userId &&
      !note.collaborators.some((c) => c.userId === userId)
    ) {
      throw new ForbiddenException("Нет доступа к заметке");
    }
    return note;
  }

  async findOne(userId: number, id: number) {
    await this.checkAccess(userId, id);
    return this.prisma.note.findUnique({
      where: { id },
      include: { tags: true, collaborators: true },
    });
  }

  async update(userId: number, id: number, dto: UpdateNoteDto) {
    await this.checkAccess(userId, id);
    const { tags, deadline, ...rest } = dto;
    return this.prisma.note.update({
      where: { id },
      data: {
        ...rest,
        ...(deadline ? { deadline: new Date(deadline) } : {}),
        ...(tags ? { tags: { set: tags.map((id) => ({ id })) } } : {}),
      },
      include: { tags: true, collaborators: true },
    });
  }

  async remove(userId: number, id: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId)
      throw new NotFoundException("Заметка не найдена");
    return this.prisma.note.delete({ where: { id } });
  }

  async pin(userId: number, id: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId)
      throw new NotFoundException("Заметка не найдена");
    return this.prisma.note.update({
      where: { id },
      data: { pinned: true },
      include: { tags: true },
    });
  }

  async archive(userId: number, id: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId)
      throw new NotFoundException("Заметка не найдена");
    return this.prisma.note.update({
      where: { id },
      data: { archived: true },
      include: { tags: true },
    });
  }

  async setDeadline(userId: number, id: number, deadline: string) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId)
      throw new NotFoundException("Заметка не найдена");
    return this.prisma.note.update({
      where: { id },
      data: { deadline: new Date(deadline) },
      include: { tags: true },
    });
  }

  async removeDeadline(userId: number, id: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId)
      throw new NotFoundException("Заметка не найдена");
    return this.prisma.note.update({
      where: { id },
      data: { deadline: null },
      include: { tags: true },
    });
  }

  async share(userId: number, id: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId)
      throw new NotFoundException("Заметка не найдена");
    if (note.publicToken) {
      return { url: `/public/${note.publicToken}` };
    }
    const publicToken = randomUUID();
    await this.prisma.note.update({
      where: { id },
      data: { publicToken },
    });
    return { url: `/public/${publicToken}` };
  }

  async getPublic(token: string) {
    const note = await this.prisma.note.findUnique({
      where: { publicToken: token },
      include: { tags: true },
    });
    if (!note) throw new NotFoundException("Публичная заметка не найдена");
    return note;
  }

  async addCollaborator(
    noteId: number,
    userId: number,
    collaboratorId: number
  ) {
    // Проверка, что note принадлежит userId
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== userId)
      throw new NotFoundException("Заметка не найдена или нет доступа");
    // Проверка, что пользователь существует
    const user = await this.prisma.user.findUnique({
      where: { id: collaboratorId },
    });
    if (!user) throw new NotFoundException("Пользователь не найден");
    // Добавление коллаборатора
    await this.prisma.collaborator.create({
      data: { noteId, userId: collaboratorId },
    });
    return { success: true };
  }
}
