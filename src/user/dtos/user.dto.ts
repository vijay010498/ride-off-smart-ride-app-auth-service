import { Expose, Transform } from 'class-transformer';

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
  signedUp: boolean;

  @Transform(({ obj }) => obj._id)
  @Expose()
  userId: string;
}
