import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class SendSmsDto {
  @ApiProperty({
    example: "+79991234567",
    description: "Номер телефона пользователя",
  })
  @IsString()
  @Matches(/^\+?\d{11,15}$/, { message: "Некорректный формат телефона" })
  phone!: string;
}
