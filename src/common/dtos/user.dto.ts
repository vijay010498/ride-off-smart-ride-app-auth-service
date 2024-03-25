import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  // Cannot send as object since we use plainToInstance in serialize

  @ApiProperty()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  faceIdVerified: boolean;

  @ApiProperty()
  @Expose()
  isBlocked: boolean;

  @ApiProperty()
  @Transform(({ obj }) => obj.lastLocation.coordinates[0])
  @Expose()
  lastLongitude: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.lastLocation.coordinates[1])
  @Expose()
  lastLatitude: number;

  @ApiProperty()
  @Expose()
  signedUp: boolean;

  @ApiProperty()
  @Transform(({ obj }) => obj._id)
  @Expose()
  userId: string;

  @ApiProperty()
  @Expose()
  online: boolean;
}
