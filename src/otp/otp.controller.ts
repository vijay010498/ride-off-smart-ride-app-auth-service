import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly optService: OtpService) {}

  @Post('/generate')
  generateOtp(@Body('phoneNumber') phoneNumber: string) {
    return this.optService.sendOTP(phoneNumber);
  }
}
