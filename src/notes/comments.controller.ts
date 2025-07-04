import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@ApiTags("comments")
@ApiBearerAuth()
@Controller("notes/:noteId/comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Добавить комментарий к заметке" })
  @ApiResponse({ status: 201, description: "Комментарий создан" })
  create(
    @Req() req: Request,
    @Param("noteId") noteId: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.commentsService.create(Number(noteId), req.user!.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Получить все комментарии к заметке" })
  @ApiResponse({ status: 200, description: "Список комментариев" })
  findAll(@Param("noteId") noteId: string) {
    return this.commentsService.findAll(Number(noteId));
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Обновить комментарий" })
  @ApiResponse({ status: 200, description: "Комментарий обновлён" })
  update(
    @Req() req: Request,
    @Param("noteId") noteId: string,
    @Param("id") id: string,
    @Body() dto: UpdateCommentDto
  ) {
    return this.commentsService.update(req.user!.userId, Number(id), dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Удалить комментарий" })
  @ApiResponse({ status: 200, description: "Комментарий удалён" })
  remove(
    @Req() req: Request,
    @Param("noteId") noteId: string,
    @Param("id") id: string
  ) {
    return this.commentsService.remove(req.user!.userId, Number(id));
  }
}
