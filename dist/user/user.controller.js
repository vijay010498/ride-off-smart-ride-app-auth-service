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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const accessToken_guard_1 = require("../common/guards/accessToken.guard");
const current_user_interceptor_1 = require("../common/interceptors/current-user.interceptor");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const isBlocked_guard_1 = require("../common/guards/isBlocked.guard");
const serialize_interceptor_1 = require("../common/interceptors/serialize.interceptor");
const user_dto_1 = require("./dtos/user.dto");
const user_token_decorator_1 = require("../common/decorators/user-token.decorator");
const tokenBlacklist_guard_1 = require("../common/guards/tokenBlacklist.guard");
const sign_up_dto_1 = require("./dtos/sign-up.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    signup(body, user, res) {
        if (user && user.signedUp) {
            return res.status(409).json({ successful: "false", message: "User is already signed up" });
        }
        body.signedUp = true;
        this.userService.update(user.id, body);
        return res.status(201).json({ successful: "true", message: "Signed up successfully" });
    }
    logout(user, tokens) {
        return this.userService.logout(user.id, tokens.accessToken);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, isBlocked_guard_1.IsBlockedGuard, tokenBlacklist_guard_1.TokenBlacklistGuard),
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Response)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_up_dto_1.SignUpDto, Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "signup", null);
__decorate([
    (0, common_1.UseGuards)(accessToken_guard_1.AccessTokenGuard, isBlocked_guard_1.IsBlockedGuard, tokenBlacklist_guard_1.TokenBlacklistGuard),
    (0, common_1.Get)('/logout'),
    (0, serialize_interceptor_1.Serialize)(user_dto_1.UserDto),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, user_token_decorator_1.UserTokens)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "logout", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, common_1.UseInterceptors)(current_user_interceptor_1.CurrentUserInterceptor),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map