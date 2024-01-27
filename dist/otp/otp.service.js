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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const aws_service_1 = require("../aws/aws.service");
const crypto_1 = require("crypto");
const user_service_1 = require("../user/user.service");
const token_service_1 = require("../token/token.service");
let OtpService = class OtpService {
    constructor(otpCollection, awsService, userService, tokenService) {
        this.otpCollection = otpCollection;
        this.awsService = awsService;
        this.userService = userService;
        this.tokenService = tokenService;
    }
    _generateOTP(length = 6) {
        const characters = '0123456789';
        const charactersLength = characters.length;
        let otp = '';
        const randomBytesBuffer = (0, crypto_1.randomBytes)(length);
        for (let i = 0; i < length; i++) {
            const randomIndex = randomBytesBuffer.readUInt8(i) % charactersLength;
            otp += characters.charAt(randomIndex);
        }
        return otp;
    }
    async _OTPExists(phoneNumber) {
        const optExists = await this.otpCollection.findOne({ phoneNumber });
        return {
            otpObject: optExists,
            otpExists: optExists ? true : false,
        };
    }
    async _deleteOTP(phoneNumber) {
        await this.otpCollection.findOneAndDelete({
            phoneNumber,
        });
        return true;
    }
    async sendOTP(phoneNumber) {
        try {
            const [{ otpExists: existingOTP }] = await Promise.all([
                this._OTPExists(phoneNumber),
            ]);
            if (existingOTP) {
                throw new common_1.UnprocessableEntityException('OTP already generated / not expired, please resend OTP');
            }
            const OTP = this._generateOTP();
            const otpDocument = new this.otpCollection({ phoneNumber, otp: OTP });
            await Promise.all([
                otpDocument.save(),
                this.awsService.sendOtpToPhone(phoneNumber, OTP),
            ]);
            return { success: true, message: 'OTP sent successfully' };
        }
        catch (err) {
            if (err instanceof common_1.UnprocessableEntityException) {
                throw err;
            }
            else {
                console.error(err);
                throw new common_1.InternalServerErrorException('Failed to send OTP, please try again later');
            }
        }
    }
    async verifyOtp(attrs) {
        try {
            const [{ otpObject, otpExists: existingOTP }] = await Promise.all([
                this._OTPExists(attrs.phoneNumber),
            ]);
            if (!existingOTP) {
                throw new common_1.UnprocessableEntityException('OTP Not Generated');
            }
            if (otpObject.otp !== attrs.userOtp.toString()) {
                throw new common_1.BadRequestException('Verification Failed/ Wrong OTP');
            }
            let [_, user] = await Promise.all([
                this._deleteOTP(attrs.phoneNumber),
                this.userService.getUserByPhone(attrs.phoneNumber),
            ]);
            let isSignedUp = false;
            if (user && user.signedUp) {
                isSignedUp = true;
            }
            else if (!user) {
                user = await this.userService.createUserByPhone(attrs.phoneNumber);
            }
            const { accessToken, refreshToken } = await this.tokenService.getTokens(user.id, user.phoneNumber);
            await this.tokenService.updateRefreshToken(user.id, refreshToken);
            return {
                status: 'OTP Verified Successfully',
                isSignedUp,
                accessToken,
                refreshToken,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnprocessableEntityException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            else {
                console.error(error);
                throw new common_1.InternalServerErrorException('Failed to Verify OTP, please try again later');
            }
        }
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Otp')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        aws_service_1.AwsService,
        user_service_1.UserService,
        token_service_1.TokenService])
], OtpService);
//# sourceMappingURL=otp.service.js.map