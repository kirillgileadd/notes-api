"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotesService = class NotesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.note.create({
            data: {
                title: dto.title,
                content: dto.content,
                userId,
            },
            include: { tags: true },
        });
    }
    async findAll(userId, filter) {
        const where = { userId };
        if ((filter === null || filter === void 0 ? void 0 : filter.from) || (filter === null || filter === void 0 ? void 0 : filter.to)) {
            where.createdAt = {};
            if (filter.from)
                where.createdAt.gte = new Date(filter.from);
            if (filter.to)
                where.createdAt.lte = new Date(filter.to);
        }
        if (filter === null || filter === void 0 ? void 0 : filter.search) {
            where.title = { contains: filter.search, mode: "insensitive" };
        }
        if (filter === null || filter === void 0 ? void 0 : filter.tag) {
            where.tags = { some: { name: filter.tag } };
        }
        return this.prisma.note.findMany({
            where,
            orderBy: { createdAt: (filter === null || filter === void 0 ? void 0 : filter.sort) || "desc" },
            include: { tags: true },
        });
    }
    async findOne(userId, id) {
        const note = await this.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== userId)
            throw new common_1.NotFoundException("Заметка не найдена");
        return note;
    }
    async update(userId, id, dto) {
        const note = await this.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== userId)
            throw new common_1.NotFoundException("Заметка не найдена");
        return this.prisma.note.update({
            where: { id },
            data: dto,
            include: { tags: true },
        });
    }
    async remove(userId, id) {
        const note = await this.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== userId)
            throw new common_1.NotFoundException("Заметка не найдена");
        return this.prisma.note.delete({ where: { id } });
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotesService);
//# sourceMappingURL=notes.service.js.map