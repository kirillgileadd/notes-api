import { AuthService } from "./auth.service";
import { SendSmsDto } from "./dto/send-sms.dto";
import { LoginDto } from "./dto/login.dto";
import { Response, Request } from "express";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    sendCode(dto: SendSmsDto): Promise<{
        message: string;
        code: string;
    }>;
    login(dto: LoginDto, req: Request, res: Response): Promise<void>;
    refresh(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
}
