import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { SmsService } from "./sms.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "supersecret",
      signOptions: { expiresIn: "15m" },
    }),
  ],
  providers: [AuthService, JwtStrategy, SmsService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
