import { IsString } from 'class-validator';

export class UpdateTokensDto {
  @IsString()
  refreshToken: string;
}
