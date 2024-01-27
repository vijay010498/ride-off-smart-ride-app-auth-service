import { OtpService } from './otp.service';
import { GenerateOtpDto } from './dtos/generate-otp.dto';
import { VerifyOptDto } from './dtos/verify-opt.dto';
export declare class OtpController {
    private readonly optService;
    constructor(optService: OtpService);
    generateOtp(body: GenerateOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(body: VerifyOptDto): Promise<{
        status: string;
        isSignedUp: boolean;
        accessToken: string;
        refreshToken: string;
    }>;
}
