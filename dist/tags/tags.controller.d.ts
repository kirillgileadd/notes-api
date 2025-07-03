import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    create(dto: CreateTagDto): Promise<{
        id: number;
        name: string;
    }>;
    findAll(): Promise<{
        id: number;
        name: string;
    }[]>;
    findOne(id: string): Promise<{
        id: number;
        name: string;
    }>;
    update(id: string, dto: UpdateTagDto): Promise<{
        id: number;
        name: string;
    }>;
    remove(id: string): Promise<{
        id: number;
        name: string;
    }>;
}
