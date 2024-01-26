import { IsEmail, IsLatitude, IsLongitude, IsString } from 'class-validator';
export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsLatitude()
  lastLocationLat: number;

  @IsLongitude()
  lastLocationLng: number;
}
