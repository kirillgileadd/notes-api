import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "+79991234567",
    description: "Номер телефона пользователя",
  })
  @IsString()
  @Matches(/^\+?\d{11,15}$/, { message: "Некорректный формат телефона" })
  phone!: string;

  @ApiProperty({ example: "123456", description: "Код подтверждения из SMS" })
  @IsString()
  @Length(6, 6, { message: "Код должен содержать 6 символов" })
  code!: string;
}
