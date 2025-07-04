import { Module } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { NotesGateway } from "./notes.gateway";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [NotesController],
  providers: [NotesService, NotesGateway],
})
export class NotesModule {}
