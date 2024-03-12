import { IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateOtpDto {
  @ApiProperty({
    description: 'Phone number to send OTP',
    format: 'xxx-xxx-xxx',
  })
  @Matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: 'Phone Number must be in format 556-556-4035',
  })
  @IsNotEmpty()
  phoneNumber: string;
}
