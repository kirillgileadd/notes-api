import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateNoteDto {
  @ApiProperty({ example: "Заголовок заметки", description: "Заголовок" })
  @IsString()
  @Length(1, 100)
  title!: string;

  @ApiProperty({ example: "Текст заметки", description: "Контент" })
  @IsString()
  content!: string;
}
