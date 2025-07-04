import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(noteId: number, userId: number, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: { content: dto.content, noteId, userId },
    });
  }

  async findAll(noteId: number) {
    return this.prisma.comment.findMany({
      where: { noteId },
      orderBy: { createdAt: "asc" },
      include: { user: true },
    });
  }

  async update(userId: number, id: number, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException("Комментарий не найден");
    if (comment.userId !== userId) throw new ForbiddenException("Нет доступа");
    return this.prisma.comment.update({ where: { id }, data: dto });
  }

  async remove(userId: number, id: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException("Комментарий не найден");
    if (comment.userId !== userId) throw new ForbiddenException("Нет доступа");
    return this.prisma.comment.delete({ where: { id } });
  }
}
