import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class AddCollaboratorDto {
  @ApiProperty({ example: 2, description: "ID пользователя-коллаборатора" })
  @IsInt()
  userId!: number;
}
