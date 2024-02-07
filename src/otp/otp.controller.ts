import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import { GenerateOtpDto } from './dtos/generate-otp.dto';
import { VerifyOptDto } from './dtos/verify-opt.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { GenerateOtpResponseDto } from './dtos/generate-otp-response.dto';
import { VerifyOtpResponseDto } from './dtos/verify-otp-response.dto';
import { ResendOtpResponseDto } from './dtos/resend-otp-response.dto';

@ApiTags('otp')
@Controller('otp')
export class OtpController {
  constructor(private readonly optService: OtpService) {}

  @ApiUnprocessableEntityResponse({
    description: 'OTP already generated / not expired, please resend OTP',
  })
  @ApiAcceptedResponse({
    description: 'Opt successfully sent',
    type: GenerateOtpResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to send OTP, please try again later',
  })
  @Post('/generate')
  generateOtp(@Body() generateOtpDto: GenerateOtpDto) {
    return this.optService.sendOTP(generateOtpDto.phoneNumber);
  }

  @ApiUnprocessableEntityResponse({
    description: 'OTP Not Generated',
  })
  @ApiBadRequestResponse({
    description: 'Verification Failed/ Wrong OTP',
  })
  @ApiCreatedResponse({
    description: 'Otp Verification Success',
    type: VerifyOtpResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to Verify OTP, please try again later',
  })
  @Post('/verify')
  verifyOtp(@Body() verifyOptDto: VerifyOptDto) {
    return this.optService.verifyOtp(verifyOptDto);
  }

  @ApiUnprocessableEntityResponse({
    description: 'Otp Sent within last 2 minutes',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Otp Not generated',
  })
  @ApiAcceptedResponse({
    description: 'Otp re-sent successfully',
    type: ResendOtpResponseDto,
  })
  @Post('/resend')
  resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.optService.resendOtp(resendOtpDto.phoneNumber);
  }
}
