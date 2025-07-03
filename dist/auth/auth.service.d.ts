import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { SmsService } from "./sms.service";
import { Response } from "express";
import { AuthTokensDto } from "./dto/auth-tokens.dto";
export declare class AuthService {
    private prisma;
    private jwtService;
    private smsService;
    constructor(prisma: PrismaService, jwtService: JwtService, smsService: SmsService);
    sendSmsCode(phone: string): Promise<{
        message: string;
        code: string;
    }>;
    verifySmsCode(phone: string, code: string, res?: Response, userAgent?: string): Promise<AuthTokensDto>;
    refreshTokens(userId: number, refreshToken: string, res?: Response, userAgent?: string): Promise<AuthTokensDto>;
    logout(refreshToken: string): Promise<void>;
}
