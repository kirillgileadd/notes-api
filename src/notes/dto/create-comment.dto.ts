import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    example: "Отличная заметка!",
    description: "Текст комментария",
  })
  @IsString()
  @Length(1, 500)
  content!: string;
}
