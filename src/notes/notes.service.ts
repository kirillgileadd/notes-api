import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        title: dto.title,
        content: dto.content,
        userId,
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
      tag?: string;
    }
  ) {
    const where: any = { userId };
    if (filter?.from || filter?.to) {
      where.createdAt = {};
      if (filter.from) where.createdAt.gte = new Date(filter.from);
      if (filter.to) where.createdAt.lte = new Date(filter.to);
    }
    if (filter?.search) {
      where.title = { contains: filter.search, mode: "insensitive" };
    }
    if (filter?.tag) {
      where.tags = { some: { name: filter.tag } };
    }
    return this.prisma.note.findMany({
      where,
      orderBy: { createdAt: filter?.sort || "desc" },
      include: { tags: true },
    });
  }

  async findOne(userId: number, id: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId)
      throw new NotFoundException("Заметка не найдена");
    return note;
  }

  async update(userId: number, id: number, dto: UpdateNoteDto) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId)
      throw new NotFoundException("Заметка не найдена");
    return this.prisma.note.update({
      where: { id },
      data: dto,
      include: { tags: true },
    });
  }

  async remove(userId: number, id: number) {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId)
      throw new NotFoundException("Заметка не найдена");
    return this.prisma.note.delete({ where: { id } });
  }
}
