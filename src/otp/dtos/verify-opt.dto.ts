import { IsString } from 'class-validator';
import { GenerateOtpDto } from './generate-otp.dto';

export class VerifyOptDto extends GenerateOtpDto {
  @IsString()
  userOtp: string;
}
