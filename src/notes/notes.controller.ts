import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";
import { AddCollaboratorDto } from "./dto/add-collaborator.dto";

@ApiTags("notes")
@ApiBearerAuth()
@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Создать заметку" })
  @ApiResponse({ status: 201, description: "Заметка создана" })
  create(@Req() req: Request, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user!.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Получить все заметки пользователя" })
  @ApiResponse({ status: 200, description: "Список заметок" })
  @ApiQuery({ name: "from", required: false })
  @ApiQuery({ name: "to", required: false })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "sort", required: false, enum: ["asc", "desc"] })
  @ApiQuery({
    name: "tags",
    required: false,
    type: [Number],
    description: "Массив id тегов",
  })
  findAll(
    @Req() req: Request,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("search") search?: string,
    @Query("sort") sort?: "asc" | "desc",
    @Query("tags") tags?: string
  ) {
    return this.notesService.findAll(req.user!.userId, {
      from,
      to,
      search,
      sort,
      tags: tags ? tags.split(",").map(Number) : undefined,
    });
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Получить заметку по id" })
  @ApiResponse({ status: 200, description: "Заметка" })
  findOne(@Req() req: Request, @Param("id") id: string) {
    return this.notesService.findOne(req.user!.userId, Number(id));
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Обновить заметку" })
  @ApiResponse({ status: 200, description: "Заметка обновлена" })
  update(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: UpdateNoteDto
  ) {
    return this.notesService.update(req.user!.userId, Number(id), dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Удалить заметку" })
  @ApiResponse({ status: 200, description: "Заметка удалена" })
  remove(@Req() req: Request, @Param("id") id: string) {
    return this.notesService.remove(req.user!.userId, Number(id));
  }

  @Post(":id/pin")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Закрепить заметку" })
  @ApiResponse({ status: 200, description: "Заметка закреплена" })
  pin(@Req() req: Request, @Param("id") id: string) {
    return this.notesService.pin(req.user!.userId, Number(id));
  }

  @Post(":id/archive")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Заархивировать заметку" })
  @ApiResponse({ status: 200, description: "Заметка заархивирована" })
  archive(@Req() req: Request, @Param("id") id: string) {
    return this.notesService.archive(req.user!.userId, Number(id));
  }

  @Get("archived")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Получить все архивные заметки пользователя" })
  @ApiResponse({ status: 200, description: "Список архивных заметок" })
  @ApiQuery({ name: "from", required: false })
  @ApiQuery({ name: "to", required: false })
  @ApiQuery({ name: "search", required: false })
  @ApiQuery({ name: "sort", required: false, enum: ["asc", "desc"] })
  @ApiQuery({
    name: "tags",
    required: false,
    type: [Number],
    description: "Массив id тегов",
  })
  findArchived(
    @Req() req: Request,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("search") search?: string,
    @Query("sort") sort?: "asc" | "desc",
    @Query("tags") tags?: string
  ) {
    return this.notesService.findArchived(req.user!.userId, {
      from,
      to,
      search,
      sort,
      tags: tags ? tags.split(",").map(Number) : undefined,
    });
  }

  @Post(":id/share")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Сгенерировать публичную ссылку на заметку" })
  @ApiResponse({ status: 200, description: "Публичная ссылка сгенерирована" })
  share(@Req() req: Request, @Param("id") id: string) {
    return this.notesService.share(req.user!.userId, Number(id));
  }

  @Get("/public/:token")
  @ApiOperation({ summary: "Получить публичную заметку по токену" })
  @ApiResponse({ status: 200, description: "Публичная заметка" })
  getPublic(@Param("token") token: string) {
    return this.notesService.getPublic(token);
  }

  @Post(":id/collaborators")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Добавить коллаборатора к заметке" })
  @ApiResponse({ status: 200, description: "Коллаборатор добавлен" })
  addCollaborator(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: AddCollaboratorDto
  ) {
    return this.notesService.addCollaborator(
      Number(id),
      req.user!.userId,
      dto.userId
    );
  }
}
