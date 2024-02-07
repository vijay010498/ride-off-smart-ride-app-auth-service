import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  isSignedUp: boolean;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  constructor(response: VerifyOtpResponseDto) {
    Object.assign(this, response);
  }
}
