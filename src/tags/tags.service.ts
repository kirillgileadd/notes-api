import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    try {
      return await this.prisma.tag.create({ data: dto });
    } catch (e) {
      throw new ConflictException('Тег с таким именем уже существует');
    }
  }

  async findAll() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('Тег не найден');
    return tag;
  }

  async update(id: number, dto: UpdateTagDto) {
    try {
      return await this.prisma.tag.update({ where: { id }, data: dto });
    } catch (e) {
      throw new ConflictException('Тег с таким именем уже существует');
    }
  }

  async remove(id: number) {
    return this.prisma.tag.delete({ where: { id } });
  }
} 