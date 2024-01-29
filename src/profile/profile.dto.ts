import { IsEmail, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
