import { ApiProperty } from '@nestjs/swagger';
export class CreateVehicleResponseDto {
  @ApiProperty()
  status: string;

  @ApiProperty()
  message: string;

  constructor(response: CreateVehicleResponseDto) {
    Object.assign(this, response);
  }
}
