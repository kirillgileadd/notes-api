import { ApiProperty } from "@nestjs/swagger";
import { IsDateString } from "class-validator";

export class SetDeadlineDto {
  @ApiProperty({
    example: "2024-12-31T23:59:59.000Z",
    description: "Дедлайн заметки (ISO 8601 формат)",
  })
  @IsDateString()
  deadline!: string;
}
