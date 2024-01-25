import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// TODO complete User Schema
@Schema({ timestamps: true, id: true })
export class User {
  @Prop({
    required: true,
    match: /^\d{3}-\d{3}-\d{4}$/,
    unique: true,
    index: true,
  })
  phoneNumber: string;

  @Prop({
    default: false,
  })
  signedUp: boolean;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
