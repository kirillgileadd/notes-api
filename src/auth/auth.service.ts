import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { SmsService } from "./sms.service";
import * as bcrypt from "bcryptjs";
import { Response } from "express";
import { AuthTokensDto } from "./dto/auth-tokens.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private smsService: SmsService
  ) {}

  async sendSmsCode(phone: string) {
    // Генерируем 6-значный код
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Сохраняем код в БД (или в реальном проекте — в Redis)
    await this.prisma.smsCode.upsert({
      where: { phone },
      update: { code },
      create: { phone, code },
    });
    // Отправляем SMS (заглушка)
    await this.smsService.send(phone, code);
    // Возвращаем код прямо в ответе для разработки
    return { message: "Код отправлен", code };
  }

  async verifySmsCode(
    phone: string,
    code: string,
    res?: Response,
    userAgent?: string
  ): Promise<AuthTokensDto> {
    const record = await this.prisma.smsCode.findUnique({ where: { phone } });
    if (!record || record.code !== code) {
      throw new UnauthorizedException("Неверный код");
    }
    // Удаляем код после успешной проверки
    await this.prisma.smsCode.delete({ where: { phone } });
    // Проверяем, есть ли пользователь
    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({ data: { phone, role: "user" } });
    }
    // Генерируем токены
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: "15m",
    });
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: "7d",
    });
    // Сохраняем refresh токен в отдельную таблицу
    // Удаляем старый токен для этого userId и userAgent
    await this.prisma.token.deleteMany({
      where: { userId: user.id, userAgent },
    });
    await this.prisma.token.create({
      data: { token: refresh_token, userId: user.id, userAgent },
    });
    // Если есть res, кладём refresh токен в httpOnly cookie
    if (res) {
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    return { access_token, refresh_token };
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
    res?: Response,
    userAgent?: string
  ): Promise<AuthTokensDto> {
    const tokenRecord = await this.prisma.token.findFirst({
      where: { userId, token: refreshToken },
    });
    if (!tokenRecord) {
      throw new UnauthorizedException("Неверный refresh токен");
    }
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("Пользователь не найден");
    }
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: "15m",
    });
    const new_refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: "7d",
    });
    // Обновляем токен в таблице (можно сделать удаление старого и создание нового)
    await this.prisma.token.update({
      where: { id: tokenRecord.id },
      data: { token: new_refresh_token, userAgent },
    });
    if (res) {
      res.cookie("refresh_token", new_refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    return { access_token, refresh_token: new_refresh_token };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.token.deleteMany({ where: { token: refreshToken } });
  }
}
