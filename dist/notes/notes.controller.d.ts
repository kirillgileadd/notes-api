import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { Request } from "express";
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    create(req: Request, dto: CreateNoteDto): Promise<{
        tags: {
            id: number;
            name: string;
        }[];
    } & {
        id: number;
        title: string;
        content: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: Request, from?: string, to?: string, search?: string, sort?: "asc" | "desc", tag?: string): Promise<({
        tags: {
            id: number;
            name: string;
        }[];
    } & {
        id: number;
        title: string;
        content: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(req: Request, id: string): Promise<{
        id: number;
        title: string;
        content: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(req: Request, id: string, dto: UpdateNoteDto): Promise<{
        tags: {
            id: number;
            name: string;
        }[];
    } & {
        id: number;
        title: string;
        content: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(req: Request, id: string): Promise<{
        id: number;
        title: string;
        content: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
