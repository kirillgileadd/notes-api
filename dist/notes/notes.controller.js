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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notes_service_1 = require("./notes.service");
const create_note_dto_1 = require("./dto/create-note.dto");
const update_note_dto_1 = require("./dto/update-note.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const add_collaborator_dto_1 = require("./dto/add-collaborator.dto");
let NotesController = class NotesController {
    constructor(notesService) {
        this.notesService = notesService;
    }
    create(req, dto) {
        return this.notesService.create(req.user.userId, dto);
    }
    findAll(req, from, to, search, sort, tags) {
        return this.notesService.findAll(req.user.userId, {
            from,
            to,
            search,
            sort,
            tags: tags ? tags.split(",").map(Number) : undefined,
        });
    }
    findOne(req, id) {
        return this.notesService.findOne(req.user.userId, Number(id));
    }
    update(req, id, dto) {
        return this.notesService.update(req.user.userId, Number(id), dto);
    }
    remove(req, id) {
        return this.notesService.remove(req.user.userId, Number(id));
    }
    pin(req, id) {
        return this.notesService.pin(req.user.userId, Number(id));
    }
    archive(req, id) {
        return this.notesService.archive(req.user.userId, Number(id));
    }
    findArchived(req, from, to, search, sort, tags) {
        return this.notesService.findArchived(req.user.userId, {
            from,
            to,
            search,
            sort,
            tags: tags ? tags.split(",").map(Number) : undefined,
        });
    }
    share(req, id) {
        return this.notesService.share(req.user.userId, Number(id));
    }
    getPublic(token) {
        return this.notesService.getPublic(token);
    }
    addCollaborator(req, id, dto) {
        return this.notesService.addCollaborator(Number(id), req.user.userId, dto.userId);
    }
};
exports.NotesController = NotesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Создать заметку" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Заметка создана" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_note_dto_1.CreateNoteDto]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Получить все заметки пользователя" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Список заметок" }),
    (0, swagger_1.ApiQuery)({ name: "from", required: false }),
    (0, swagger_1.ApiQuery)({ name: "to", required: false }),
    (0, swagger_1.ApiQuery)({ name: "search", required: false }),
    (0, swagger_1.ApiQuery)({ name: "sort", required: false, enum: ["asc", "desc"] }),
    (0, swagger_1.ApiQuery)({
        name: "tags",
        required: false,
        type: [Number],
        description: "Массив id тегов",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("from")),
    __param(2, (0, common_1.Query)("to")),
    __param(3, (0, common_1.Query)("search")),
    __param(4, (0, common_1.Query)("sort")),
    __param(5, (0, common_1.Query)("tags")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Получить заметку по id" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Заметка" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Обновить заметку" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Заметка обновлена" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_note_dto_1.UpdateNoteDto]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Удалить заметку" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Заметка удалена" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/pin"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Закрепить заметку" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Заметка закреплена" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "pin", null);
__decorate([
    (0, common_1.Post)(":id/archive"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Заархивировать заметку" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Заметка заархивирована" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "archive", null);
__decorate([
    (0, common_1.Get)("archived"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Получить все архивные заметки пользователя" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Список архивных заметок" }),
    (0, swagger_1.ApiQuery)({ name: "from", required: false }),
    (0, swagger_1.ApiQuery)({ name: "to", required: false }),
    (0, swagger_1.ApiQuery)({ name: "search", required: false }),
    (0, swagger_1.ApiQuery)({ name: "sort", required: false, enum: ["asc", "desc"] }),
    (0, swagger_1.ApiQuery)({
        name: "tags",
        required: false,
        type: [Number],
        description: "Массив id тегов",
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("from")),
    __param(2, (0, common_1.Query)("to")),
    __param(3, (0, common_1.Query)("search")),
    __param(4, (0, common_1.Query)("sort")),
    __param(5, (0, common_1.Query)("tags")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "findArchived", null);
__decorate([
    (0, common_1.Post)(":id/share"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Сгенерировать публичную ссылку на заметку" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Публичная ссылка сгенерирована" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "share", null);
__decorate([
    (0, common_1.Get)("/public/:token"),
    (0, swagger_1.ApiOperation)({ summary: "Получить публичную заметку по токену" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Публичная заметка" }),
    __param(0, (0, common_1.Param)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "getPublic", null);
__decorate([
    (0, common_1.Post)(":id/collaborators"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Добавить коллаборатора к заметке" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Коллаборатор добавлен" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_collaborator_dto_1.AddCollaboratorDto]),
    __metadata("design:returntype", void 0)
], NotesController.prototype, "addCollaborator", null);
exports.NotesController = NotesController = __decorate([
    (0, swagger_1.ApiTags)("notes"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("notes"),
    __metadata("design:paramtypes", [notes_service_1.NotesService])
], NotesController);
//# sourceMappingURL=notes.controller.js.map