import { IsEmail, IsString, Matches, isBoolean } from 'class-validator';

export class SignUpDto {
    @IsString()
    firstName: string;
  
    @IsString()
    lastName: string;
  
    @IsEmail()
    email: string;
    
    signedUp: boolean;

}
  