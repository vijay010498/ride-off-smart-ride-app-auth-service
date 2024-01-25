import { IsNumber } from 'class-validator';
import { GenerateOtpDto } from './generate-otp.dto';

export class VerifyOptDto extends GenerateOtpDto {
  @IsNumber()
  userOtp: number;
}
