"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const client_1 = require("@prisma/client");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const prisma = new client_1.PrismaClient();
    const roles = ["admin", "user", "manager"];
    for (const role of roles) {
        const phone = `+7000000000${roles.indexOf(role)}`;
        const exists = await prisma.user.findFirst({ where: { role } });
        if (!exists) {
            await prisma.user.create({ data: { phone, role } });
        }
    }
    app.use(cookieParser());
    app.enableCors({
        origin: "*",
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Notes API")
        .setDescription("API для заметок с авторизацией")
        .setVersion("1.0")
        .addBearerAuth()
        .addCookieAuth("refresh_token")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map