import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  Length,
  IsArray,
  IsInt,
  IsDateString,
} from "class-validator";

export class UpdateNoteDto {
  @ApiPropertyOptional({ example: "Новый заголовок", description: "Заголовок" })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @ApiPropertyOptional({ example: "Новый текст", description: "Контент" })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: [1, 2], description: "ID тегов" })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @ApiPropertyOptional({
    example: "2024-12-31T23:59:59.000Z",
    description: "Дедлайн заметки (ISO 8601 формат)",
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
