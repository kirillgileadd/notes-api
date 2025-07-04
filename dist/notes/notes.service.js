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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
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
        const where = { userId, archived: false };
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
        if ((filter === null || filter === void 0 ? void 0 : filter.tags) && filter.tags.length > 0) {
            where.tags = { some: { id: { in: filter.tags } } };
        }
        return this.prisma.note.findMany({
            where,
            orderBy: { createdAt: (filter === null || filter === void 0 ? void 0 : filter.sort) || "desc" },
            include: { tags: true },
        });
    }
    async findArchived(userId, filter) {
        const where = { userId, archived: true };
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
        if ((filter === null || filter === void 0 ? void 0 : filter.tags) && filter.tags.length > 0) {
            where.tags = { some: { id: { in: filter.tags } } };
        }
        return this.prisma.note.findMany({
            where,
            orderBy: { createdAt: (filter === null || filter === void 0 ? void 0 : filter.sort) || "desc" },
            include: { tags: true },
        });
    }
    async checkAccess(userId, noteId) {
        const note = await this.prisma.note.findUnique({
            where: { id: noteId },
            include: { collaborators: true },
        });
        if (!note)
            throw new common_1.NotFoundException("Заметка не найдена");
        if (note.userId !== userId &&
            !note.collaborators.some((c) => c.userId === userId)) {
            throw new common_1.ForbiddenException("Нет доступа к заметке");
        }
        return note;
    }
    async findOne(userId, id) {
        await this.checkAccess(userId, id);
        return this.prisma.note.findUnique({
            where: { id },
            include: { tags: true, collaborators: true },
        });
    }
    async update(userId, id, dto) {
        await this.checkAccess(userId, id);
        const { tags } = dto, rest = __rest(dto, ["tags"]);
        return this.prisma.note.update({
            where: { id },
            data: Object.assign(Object.assign({}, rest), (tags ? { tags: { set: tags.map((id) => ({ id })) } } : {})),
            include: { tags: true, collaborators: true },
        });
    }
    async remove(userId, id) {
        const note = await this.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== userId)
            throw new common_1.NotFoundException("Заметка не найдена");
        return this.prisma.note.delete({ where: { id } });
    }
    async pin(userId, id) {
        const note = await this.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== userId)
            throw new common_1.NotFoundException("Заметка не найдена");
        return this.prisma.note.update({
            where: { id },
            data: { pinned: true },
            include: { tags: true },
        });
    }
    async archive(userId, id) {
        const note = await this.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== userId)
            throw new common_1.NotFoundException("Заметка не найдена");
        return this.prisma.note.update({
            where: { id },
            data: { archived: true },
            include: { tags: true },
        });
    }
    async share(userId, id) {
        const note = await this.prisma.note.findUnique({ where: { id } });
        if (!note || note.userId !== userId)
            throw new common_1.NotFoundException("Заметка не найдена");
        if (note.publicToken) {
            return { url: `/public/${note.publicToken}` };
        }
        const publicToken = (0, crypto_1.randomUUID)();
        await this.prisma.note.update({
            where: { id },
            data: { publicToken },
        });
        return { url: `/public/${publicToken}` };
    }
    async getPublic(token) {
        const note = await this.prisma.note.findUnique({
            where: { publicToken: token },
            include: { tags: true },
        });
        if (!note)
            throw new common_1.NotFoundException("Публичная заметка не найдена");
        return note;
    }
    async addCollaborator(noteId, userId, collaboratorId) {
        const note = await this.prisma.note.findUnique({ where: { id: noteId } });
        if (!note || note.userId !== userId)
            throw new common_1.NotFoundException("Заметка не найдена или нет доступа");
        const user = await this.prisma.user.findUnique({
            where: { id: collaboratorId },
        });
        if (!user)
            throw new common_1.NotFoundException("Пользователь не найден");
        await this.prisma.collaborator.create({
            data: { noteId, userId: collaboratorId },
        });
        return { success: true };
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotesService);
//# sourceMappingURL=notes.service.js.map