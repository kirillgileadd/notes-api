import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
export declare class NotesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, dto: CreateNoteDto): Promise<{
        tags: {
            name: string;
            id: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
        content: string;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    findAll(userId: number, filter?: {
        from?: string;
        to?: string;
        search?: string;
        sort?: "asc" | "desc";
        tags?: number[];
    }): Promise<({
        tags: {
            name: string;
            id: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
        content: string;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    })[]>;
    findArchived(userId: number, filter?: {
        from?: string;
        to?: string;
        search?: string;
        sort?: "asc" | "desc";
        tags?: number[];
    }): Promise<({
        tags: {
            name: string;
            id: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
        content: string;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    })[]>;
    private checkAccess;
    findOne(userId: number, id: number): Promise<({
        collaborators: {
            id: number;
            createdAt: Date;
            userId: number;
            noteId: number;
        }[];
        tags: {
            name: string;
            id: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
        content: string;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }) | null>;
    update(userId: number, id: number, dto: UpdateNoteDto): Promise<{
        collaborators: {
            id: number;
            createdAt: Date;
            userId: number;
            noteId: number;
        }[];
        tags: {
            name: string;
            id: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
        content: string;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    remove(userId: number, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
        content: string;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    pin(userId: number, id: number): Promise<{
        tags: {
            name: string;
            id: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
        content: string;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    archive(userId: number, id: number): Promise<{
        tags: {
            name: string;
            id: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
        content: string;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    share(userId: number, id: number): Promise<{
        url: string;
    }>;
    getPublic(token: string): Promise<{
        tags: {
            name: string;
            id: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        title: string;
        content: string;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    addCollaborator(noteId: number, userId: number, collaboratorId: number): Promise<{
        success: boolean;
    }>;
}
