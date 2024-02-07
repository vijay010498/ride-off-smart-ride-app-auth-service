import mongoose from 'mongoose';

export class UserFaceVerifiedDto {
  faceVerificationId: mongoose.Types.ObjectId;
  faceIdVerified: boolean;
}
