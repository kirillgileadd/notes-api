import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReactionDto } from "./dto/create-reaction.dto";

@Injectable()
export class ReactionsService {
  constructor(private prisma: PrismaService) {}

  async create(commentId: number, userId: number, dto: CreateReactionDto) {
    // Проверка: не дублируем реакцию
    const exists = await this.prisma.reaction.findUnique({
      where: {
        commentId_userId_emoji: { commentId, userId, emoji: dto.emoji },
      },
    });
    if (exists) throw new ConflictException("Реакция уже поставлена");
    return this.prisma.reaction.create({
      data: { commentId, userId, emoji: dto.emoji },
    });
  }

  async findAll(commentId: number) {
    return this.prisma.reaction.findMany({
      where: { commentId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });
  }

  async remove(userId: number, id: number) {
    const reaction = await this.prisma.reaction.findUnique({ where: { id } });
    if (!reaction) throw new NotFoundException("Реакция не найдена");
    if (reaction.userId !== userId) throw new ForbiddenException("Нет доступа");
    return this.prisma.reaction.delete({ where: { id } });
  }
}
