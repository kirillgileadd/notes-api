import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateReactionDto {
  @ApiProperty({ example: "👍", description: "Эмоджи-реакция" })
  @IsString()
  @Length(1, 10)
  emoji!: string;
}
