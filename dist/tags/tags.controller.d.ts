import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    create(dto: CreateTagDto): Promise<{
        name: string;
        id: number;
    }>;
    findAll(): Promise<{
        name: string;
        id: number;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: number;
    }>;
    update(id: string, dto: UpdateTagDto): Promise<{
        name: string;
        id: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        id: number;
    }>;
}
