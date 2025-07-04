import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: "*", // или укажи конкретный origin, например: 'http://localhost:3000'
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const wsDocUrl =
    "https://github.com/kirillgileadd/notes-api/blob/main/WEBSOCKET_API.md";
  const wsDocLocalUrl = "http://localhost:3000/docs/WEBSOCKET_API.md";
  const config = new DocumentBuilder()
    .setTitle("Notes API")
    .setDescription(
      `API для заметок с авторизацией\n\n## WebSocket API\n[Документация по WebSocket (GitHub)](${wsDocUrl})\n[Документация по WebSocket (локально)](${wsDocLocalUrl})`
    )
    .setVersion("1.0")
    .addBearerAuth()
    .addCookieAuth("refresh_token")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
