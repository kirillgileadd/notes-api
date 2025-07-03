import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class UpdateTagDto {
  @ApiPropertyOptional({
    example: "important",
    description: "Новое название тега",
  })
  @IsOptional()
  @IsString()
  @Length(1, 30)
  name?: string;
}
