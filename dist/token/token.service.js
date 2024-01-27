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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const my_config_service_1 = require("../my-config/my-config.service");
const argon2 = require("argon2");
const user_service_1 = require("../user/user.service");
let TokenService = class TokenService {
    constructor(jwtService, configService, userService) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userService = userService;
    }
    hashData(data) {
        return argon2.hash(data);
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userService.findById(userId);
        if (!user || !user.refreshToken) {
            throw new common_1.ForbiddenException('Access Denied');
        }
        const refreshTokenMatches = await argon2.verify(user.refreshToken, refreshToken);
        if (!refreshTokenMatches)
            throw new common_1.ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.phoneNumber);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.userService.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }
    async getTokens(userId, phoneNumber) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, phoneNumber }, {
                secret: this.configService.getJwtAccessSecret(),
                expiresIn: '30d',
            }),
            this.jwtService.signAsync({ sub: userId, phoneNumber }, {
                secret: this.configService.getJwtRefreshSecret(),
                expiresIn: '150d',
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        my_config_service_1.MyConfigService,
        user_service_1.UserService])
], TokenService);
//# sourceMappingURL=token.service.js.map