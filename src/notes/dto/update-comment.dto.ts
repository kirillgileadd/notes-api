import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class UpdateCommentDto {
  @ApiPropertyOptional({
    example: "Обновлённый текст",
    description: "Текст комментария",
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  content?: string;
}
