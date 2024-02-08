import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  constructor(response: ResendOtpResponseDto) {
    Object.assign(this, response);
  }
}
