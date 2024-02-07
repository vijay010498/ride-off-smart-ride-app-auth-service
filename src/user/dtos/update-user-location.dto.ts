import { IsLongitude, IsLatitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserLocationDto {
  @ApiProperty()
  @IsLongitude()
  longitude: number;

  @ApiProperty()
  @IsLatitude()
  latitude: number;
}
