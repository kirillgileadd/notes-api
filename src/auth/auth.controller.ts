import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SendSmsDto } from "./dto/send-sms.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthTokensDto } from "./dto/auth-tokens.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { Response, Request } from "express";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("send-code")
  @ApiOperation({ summary: "Отправить SMS-код на номер" })
  @ApiResponse({
    status: 201,
    description: "Код отправлен",
    schema: { example: { message: "Код отправлен", code: "123456" } },
  })
  async sendCode(@Body() dto: SendSmsDto) {
    return this.authService.sendSmsCode(dto.phone);
  }

  @Post("login")
  @ApiOperation({ summary: "Войти по номеру и коду" })
  @ApiResponse({
    status: 201,
    description: "Успешная аутентификация",
    type: AuthTokensDto,
  })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const userAgent = req.headers["user-agent"] || "";
    const tokens = await this.authService.verifySmsCode(
      dto.phone,
      dto.code,
      res,
      userAgent
    );
    res.status(201).json(tokens);
  }

  @Post("refresh")
  @ApiOperation({
    summary:
      "Обновить access и refresh токены по refresh токену из httpOnly cookie",
  })
  @ApiCookieAuth("refresh_token")
  @ApiResponse({
    status: 201,
    description: "Новая пара токенов",
    type: AuthTokensDto,
  })
  async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      res.clearCookie("refresh_token");
      throw new UnauthorizedException("Refresh токен не найден");
    }
    let payload: any;
    try {
      payload = await this.authService["jwtService"].verifyAsync(refreshToken);
    } catch (e) {
      res.clearCookie("refresh_token");
      throw new UnauthorizedException(
        "Неверный или просроченный refresh токен"
      );
    }
    const userAgent = req.headers["user-agent"] || "";
    const tokens = await this.authService.refreshTokens(
      payload.sub,
      refreshToken,
      res,
      userAgent
    );
    res.status(201).json(tokens);
  }

  @Post("logout")
  @ApiOperation({ summary: "Выйти из системы (очистить refresh токен)" })
  @ApiCookieAuth("refresh_token")
  @ApiResponse({ status: 200, description: "Выход выполнен" })
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
      res.clearCookie("refresh_token");
    }
    res.status(200).json({ message: "Выход выполнен" });
  }
}
