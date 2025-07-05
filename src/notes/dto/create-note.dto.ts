import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, Length, IsOptional, IsDateString } from "class-validator";

export class CreateNoteDto {
  @ApiProperty({ example: "Заголовок заметки", description: "Заголовок" })
  @IsString()
  @Length(1, 100)
  title!: string;

  @ApiProperty({ example: "Текст заметки", description: "Контент" })
  @IsString()
  content!: string;

  @ApiPropertyOptional({
    example: "2024-12-31T23:59:59.000Z",
    description: "Дедлайн заметки (ISO 8601 формат)",
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
