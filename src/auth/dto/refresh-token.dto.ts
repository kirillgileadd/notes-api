import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({ description: "JWT refresh token" })
  refresh_token: string;
}
