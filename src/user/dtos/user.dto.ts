import { Expose, Transform } from 'class-transformer';
import { LastLocation } from '../user.schema';

export class UserDto {
  @Expose()
  phoneNumber: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  faceIdVerified: boolean;

  @Expose()
  isBlocked: boolean;

  @Expose()
  lastLocation: LastLocation;

  @Expose()
  signedUp: boolean;

  @Transform(({ obj }) => obj._id)
  @Expose()
  userId: string;
}
