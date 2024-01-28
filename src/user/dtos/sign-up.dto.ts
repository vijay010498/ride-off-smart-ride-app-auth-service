import { IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
