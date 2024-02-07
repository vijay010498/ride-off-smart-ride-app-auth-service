import { IsString } from 'class-validator';
import { GenerateOtpDto } from './generate-otp.dto';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOptDto extends GenerateOtpDto {
  @ApiProperty({
    description: 'Enter Received OTP',
  })
  @IsString()
  userOtp: string;
}
