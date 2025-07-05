import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./auth/guards/roles.guard";
import { NotesModule } from "./notes/notes.module";
import { TagsModule } from "./tags/tags.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "docs"),
      serveRoot: "/docs",
      exclude: ["/api*"],
    }),
    PrismaModule,
    AuthModule,
    NotesModule,
    TagsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
