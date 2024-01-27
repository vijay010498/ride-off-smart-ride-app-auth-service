"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokens = void 0;
const common_1 = require("@nestjs/common");
exports.UserTokens = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    return Object.assign({}, {
        accessToken: request.user?.accessToken,
        requestRefreshToken: request.user?.refreshToken,
    });
});
//# sourceMappingURL=user-token.decorator.js.map