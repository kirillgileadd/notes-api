"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const sms_service_1 = require("./sms.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, smsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.smsService = smsService;
    }
    async sendSmsCode(phone) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await this.prisma.smsCode.upsert({
            where: { phone },
            update: { code },
            create: { phone, code },
        });
        await this.smsService.send(phone, code);
        return { message: "Код отправлен", code };
    }
    async verifySmsCode(phone, code, res, userAgent) {
        const record = await this.prisma.smsCode.findUnique({ where: { phone } });
        if (!record || record.code !== code) {
            throw new common_1.UnauthorizedException("Неверный код");
        }
        await this.prisma.smsCode.delete({ where: { phone } });
        let user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user) {
            user = await this.prisma.user.create({ data: { phone, role: "user" } });
        }
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: "15m",
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: "7d",
        });
        await this.prisma.token.deleteMany({
            where: { userId: user.id, userAgent },
        });
        await this.prisma.token.create({
            data: { token: refresh_token, userId: user.id, userAgent },
        });
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
    async refreshTokens(userId, refreshToken, res, userAgent) {
        const tokenRecord = await this.prisma.token.findFirst({
            where: { userId, token: refreshToken },
        });
        if (!tokenRecord) {
            throw new common_1.UnauthorizedException("Неверный refresh токен");
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException("Пользователь не найден");
        }
        const payload = { sub: user.id, phone: user.phone, role: user.role };
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: "15m",
        });
        const new_refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: "7d",
        });
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
    async logout(refreshToken) {
        await this.prisma.token.deleteMany({ where: { token: refreshToken } });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        sms_service_1.SmsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map