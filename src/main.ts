import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Инициализация ролей (создание пользователей с разными ролями для теста)
  const prisma = new PrismaClient();
  const roles = ["admin", "user", "manager"] as const;
  for (const role of roles) {
    const phone = `+7000000000${roles.indexOf(role)}`;
    const exists = await prisma.user.findFirst({ where: { role } });
    if (!exists) {
      await prisma.user.create({ data: { phone, role } });
    }
  }

  app.use(cookieParser());
  app.enableCors({
    origin: "*", // или укажи конкретный origin, например: 'http://localhost:3000'
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle("Notes API")
    .setDescription("API для заметок с авторизацией")
    .setVersion("1.0")
    .addBearerAuth()
    .addCookieAuth("refresh_token")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
