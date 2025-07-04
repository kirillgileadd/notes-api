import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length, IsArray, IsInt } from "class-validator";

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
}
