import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@ApiTags("notes")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("notes")
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: "Создать заметку" })
  @ApiResponse({ status: 201, description: "Заметка создана" })
  create(@Req() req: Request, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user!.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Получить все заметки пользователя" })
  @ApiResponse({ status: 200, description: "Список заметок" })
  findAll(
    @Req() req: Request,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("search") search?: string,
    @Query("sort") sort?: "asc" | "desc",
    @Query("tag") tag?: string
  ) {
    return this.notesService.findAll(req.user!.userId, {
      from,
      to,
      search,
      sort,
      tag,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить заметку по id" })
  @ApiResponse({ status: 200, description: "Заметка" })
  findOne(@Req() req: Request, @Param("id") id: string) {
    return this.notesService.findOne(req.user!.userId, Number(id));
  }

  @Patch(":id")
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
  @ApiOperation({ summary: "Удалить заметку" })
  @ApiResponse({ status: 200, description: "Заметка удалена" })
  remove(@Req() req: Request, @Param("id") id: string) {
    return this.notesService.remove(req.user!.userId, Number(id));
  }
}
