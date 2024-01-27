import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { GenerateOtpDto } from './dtos/generate-otp.dto';
import { VerifyOptDto } from './dtos/verify-opt.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';

@Controller('otp')
export class OtpController {
  constructor(private readonly optService: OtpService) {}

  @Post('/generate')
  generateOtp(@Body() body: GenerateOtpDto) {
    return this.optService.sendOTP(body.phoneNumber);
  }

  @Post('/verify')
  verifyOtp(@Body() body: VerifyOptDto) {
    return this.optService.verifyOtp(body);
  }

  @Post('/resend')
  resendOtp(@Body() body: ResendOtpDto) {
    return this.optService.resendOtp(body.phoneNumber);
  }
}
