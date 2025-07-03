import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("tags")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: "Создать тег" })
  @ApiResponse({ status: 201, description: "Тег создан" })
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Получить все теги" })
  @ApiResponse({ status: 200, description: "Список тегов" })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Получить тег по id" })
  @ApiResponse({ status: 200, description: "Тег" })
  findOne(@Param("id") id: string) {
    return this.tagsService.findOne(Number(id));
  }

  @Patch(":id")
  @ApiOperation({ summary: "Обновить тег" })
  @ApiResponse({ status: 200, description: "Тег обновлён" })
  update(@Param("id") id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(Number(id), dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Удалить тег" })
  @ApiResponse({ status: 200, description: "Тег удалён" })
  remove(@Param("id") id: string) {
    return this.tagsService.remove(Number(id));
  }
}
