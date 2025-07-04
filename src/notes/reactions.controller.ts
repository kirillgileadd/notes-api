import {
  Controller,
  Post,
  Get,
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
import { ReactionsService } from "./reactions.service";
import { CreateReactionDto } from "./dto/create-reaction.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Request } from "express";

@ApiTags("reactions")
@ApiBearerAuth()
@Controller("comments/:commentId/reactions")
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Поставить реакцию на комментарий" })
  @ApiResponse({ status: 201, description: "Реакция добавлена" })
  create(
    @Req() req: Request,
    @Param("commentId") commentId: string,
    @Body() dto: CreateReactionDto
  ) {
    return this.reactionsService.create(
      Number(commentId),
      req.user!.userId,
      dto
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Получить все реакции на комментарий" })
  @ApiResponse({ status: 200, description: "Список реакций" })
  findAll(@Param("commentId") commentId: string) {
    return this.reactionsService.findAll(Number(commentId));
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Удалить свою реакцию" })
  @ApiResponse({ status: 200, description: "Реакция удалена" })
  remove(
    @Req() req: Request,
    @Param("commentId") commentId: string,
    @Param("id") id: string
  ) {
    return this.reactionsService.remove(req.user!.userId, Number(id));
  }
}
