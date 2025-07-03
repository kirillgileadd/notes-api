import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
export declare class NotesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, dto: CreateNoteDto): Promise<{
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
    findAll(userId: number, filter?: {
        from?: string;
        to?: string;
        search?: string;
        sort?: "asc" | "desc";
        tag?: string;
    }): Promise<({
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
    findOne(userId: number, id: number): Promise<{
        id: number;
        title: string;
        content: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(userId: number, id: number, dto: UpdateNoteDto): Promise<{
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
    remove(userId: number, id: number): Promise<{
        id: number;
        title: string;
        content: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
