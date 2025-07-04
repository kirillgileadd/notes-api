import { Module } from "@nestjs/common";
import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { NotesGateway } from "./notes.gateway";
import { AuthModule } from "../auth/auth.module";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { ReactionsService } from "./reactions.service";
import { ReactionsController } from "./reactions.controller";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [NotesController, CommentsController, ReactionsController],
  providers: [NotesService, NotesGateway, CommentsService, ReactionsService],
})
export class NotesModule {}
