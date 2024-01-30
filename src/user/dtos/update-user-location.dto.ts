import { IsLongitude, IsLatitude } from 'class-validator';
export class UpdateUserLocationDto {
  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;
}
