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
exports.OtpController = void 0;
const common_1 = require("@nestjs/common");
const otp_service_1 = require("./otp.service");
const generate_otp_dto_1 = require("./dtos/generate-otp.dto");
const verify_opt_dto_1 = require("./dtos/verify-opt.dto");
let OtpController = class OtpController {
    constructor(optService) {
        this.optService = optService;
    }
    generateOtp(body) {
        return this.optService.sendOTP(body.phoneNumber);
    }
    verifyOtp(body) {
        return this.optService.verifyOtp(body);
    }
};
exports.OtpController = OtpController;
__decorate([
    (0, common_1.Post)('/generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_otp_dto_1.GenerateOtpDto]),
    __metadata("design:returntype", void 0)
], OtpController.prototype, "generateOtp", null);
__decorate([
    (0, common_1.Post)('/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_opt_dto_1.VerifyOptDto]),
    __metadata("design:returntype", void 0)
], OtpController.prototype, "verifyOtp", null);
exports.OtpController = OtpController = __decorate([
    (0, common_1.Controller)('otp'),
    __metadata("design:paramtypes", [otp_service_1.OtpService])
], OtpController);
//# sourceMappingURL=otp.controller.js.map