import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// interface Location {
//   lat: number;
//   lng: number;
// }
@Schema({ timestamps: true, id: true })
export class User {
  @Prop({
    required: true,
    match: /^\d{3}-\d{3}-\d{4}$/,
    unique: true,
    index: true,
  })
  phoneNumber: string;

  @Prop()
  email: string;

  @Prop({
    default: false,
  })
  signedUp: boolean;

  @Prop({
    default: false,
  })
  isBlocked: boolean;

  @Prop({
    default: false,
  })
  faceIdVerified: boolean;

  @Prop()
  refreshToken: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  // TODO correct location field
  // @Prop({
  //   type: { type: { type: String }, coordinates: [Number] },
  //   index: '2dsphere',
  // })
  // lastLocation: Location;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
