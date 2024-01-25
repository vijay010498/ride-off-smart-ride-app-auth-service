import { Matches, IsNumber } from 'class-validator';

export class VerifyOptDto {
  @Matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: 'Phone Number must be in format 556-556-4035',
  })
  phoneNumber: string;

  @IsNumber()
  userOtp: number;
}
