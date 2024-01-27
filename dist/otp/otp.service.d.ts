/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { OtpDocument } from './otp.schema';
import { AwsService } from '../aws/aws.service';
import { VerifyOptDto } from './dtos/verify-opt.dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
export declare class OtpService {
    private readonly otpCollection;
    private readonly awsService;
    private readonly userService;
    private readonly tokenService;
    constructor(otpCollection: Model<OtpDocument>, awsService: AwsService, userService: UserService, tokenService: TokenService);
    private _generateOTP;
    private _OTPExists;
    private _deleteOTP;
    sendOTP(phoneNumber: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(attrs: VerifyOptDto): Promise<{
        status: string;
        isSignedUp: boolean;
        accessToken: string;
        refreshToken: string;
    }>;
}
