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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UserService = class UserService {
    constructor(userCollection, UserTokenBlacklistCollection) {
        this.userCollection = userCollection;
        this.UserTokenBlacklistCollection = UserTokenBlacklistCollection;
    }
    async getUserByPhone(phoneNumber) {
        const user = await this.userCollection.findOne({
            phoneNumber,
        });
        return user;
    }
    createUserByPhone(phoneNumber) {
        const user = new this.userCollection({ phoneNumber });
        return user.save();
    }
    async findById(id) {
        return this.userCollection.findById(id);
    }
    update(id, updateUserDto) {
        return this.userCollection
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
    }
    async logout(userId, accessToken) {
        await this.update(userId, { refreshToken: null });
        const blackListToken = new this.UserTokenBlacklistCollection({
            token: accessToken,
        });
        await blackListToken.save();
    }
    async tokenInBlackList(accessToken) {
        return this.UserTokenBlacklistCollection.findOne({
            token: accessToken,
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('User')),
    __param(1, (0, mongoose_1.InjectModel)('UserTokenBlacklist')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map