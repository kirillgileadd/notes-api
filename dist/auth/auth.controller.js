"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const send_sms_dto_1 = require("./dto/send-sms.dto");
const login_dto_1 = require("./dto/login.dto");
const auth_tokens_dto_1 = require("./dto/auth-tokens.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async sendCode(dto) {
        return this.authService.sendSmsCode(dto.phone);
    }
    async login(dto, req, res) {
        const userAgent = req.headers["user-agent"] || "";
        const tokens = await this.authService.verifySmsCode(dto.phone, dto.code, res, userAgent);
        res.status(201).json(tokens);
    }
    async refresh(req, res) {
        var _a;
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (!refreshToken) {
            res.clearCookie("refresh_token");
            throw new common_1.UnauthorizedException("Refresh токен не найден");
        }
        let payload;
        try {
            payload = await this.authService["jwtService"].verifyAsync(refreshToken);
        }
        catch (e) {
            res.clearCookie("refresh_token");
            throw new common_1.UnauthorizedException("Неверный или просроченный refresh токен");
        }
        const userAgent = req.headers["user-agent"] || "";
        const tokens = await this.authService.refreshTokens(payload.sub, refreshToken, res, userAgent);
        res.status(201).json(tokens);
    }
    async logout(req, res) {
        var _a;
        const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refresh_token;
        if (refreshToken) {
            await this.authService.logout(refreshToken);
            res.clearCookie("refresh_token");
        }
        res.status(200).json({ message: "Выход выполнен" });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("send-code"),
    (0, swagger_1.ApiOperation)({ summary: "Отправить SMS-код на номер" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Код отправлен",
        schema: { example: { message: "Код отправлен", code: "123456" } },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_sms_dto_1.SendSmsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendCode", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, swagger_1.ApiOperation)({ summary: "Войти по номеру и коду" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Успешная аутентификация",
        type: auth_tokens_dto_1.AuthTokensDto,
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("refresh"),
    (0, swagger_1.ApiOperation)({
        summary: "Обновить access и refresh токены по refresh токену из httpOnly cookie",
    }),
    (0, swagger_1.ApiCookieAuth)("refresh_token"),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Новая пара токенов",
        type: auth_tokens_dto_1.AuthTokensDto,
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, swagger_1.ApiOperation)({ summary: "Выйти из системы (очистить refresh токен)" }),
    (0, swagger_1.ApiCookieAuth)("refresh_token"),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Выход выполнен" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map