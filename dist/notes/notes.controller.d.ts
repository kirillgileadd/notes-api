import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { Request } from "express";
import { AddCollaboratorDto } from "./dto/add-collaborator.dto";
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
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    findAll(req: Request, from?: string, to?: string, search?: string, sort?: "asc" | "desc", tags?: string): Promise<({
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
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    })[]>;
    findOne(req: Request, id: string): Promise<({
        tags: {
            id: number;
            name: string;
        }[];
        collaborators: {
            id: number;
            userId: number;
            createdAt: Date;
            noteId: number;
        }[];
    } & {
        id: number;
        title: string;
        content: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }) | null>;
    update(req: Request, id: string, dto: UpdateNoteDto): Promise<{
        tags: {
            id: number;
            name: string;
        }[];
        collaborators: {
            id: number;
            userId: number;
            createdAt: Date;
            noteId: number;
        }[];
    } & {
        id: number;
        title: string;
        content: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    remove(req: Request, id: string): Promise<{
        id: number;
        title: string;
        content: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    pin(req: Request, id: string): Promise<{
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
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    archive(req: Request, id: string): Promise<{
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
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    findArchived(req: Request, from?: string, to?: string, search?: string, sort?: "asc" | "desc", tags?: string): Promise<({
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
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    })[]>;
    share(req: Request, id: string): Promise<{
        url: string;
    }>;
    getPublic(token: string): Promise<{
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
        archived: boolean;
        pinned: boolean;
        publicToken: string | null;
    }>;
    addCollaborator(req: Request, id: string, dto: AddCollaboratorDto): Promise<{
        success: boolean;
    }>;
}
