"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModule = void 0;
const common_1 = require("@nestjs/common");
const token_controller_1 = require("./token.controller");
const token_service_1 = require("./token.service");
const accessToken_strategy_1 = require("./strategies/accessToken.strategy");
const refreshToken_strategy_1 = require("./strategies/refreshToken.strategy");
const jwt_1 = require("@nestjs/jwt");
const my_config_module_1 = require("../my-config/my-config.module");
const user_module_1 = require("../user/user.module");
let TokenModule = class TokenModule {
};
exports.TokenModule = TokenModule;
exports.TokenModule = TokenModule = __decorate([
    (0, common_1.Module)({
        imports: [my_config_module_1.MyConfigModule, jwt_1.JwtModule.register({}), user_module_1.UserModule],
        controllers: [token_controller_1.TokenController],
        providers: [token_service_1.TokenService, accessToken_strategy_1.AccessTokenStrategy, refreshToken_strategy_1.RefreshTokenStrategy],
        exports: [token_service_1.TokenService],
    })
], TokenModule);
//# sourceMappingURL=token.module.js.map