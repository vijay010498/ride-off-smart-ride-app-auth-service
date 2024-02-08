import { ApiProperty } from '@nestjs/swagger';

export class GenerateOtpResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  resendTime: string;

  constructor(response: GenerateOtpResponseDto) {
    Object.assign(this, response);
  }
}
