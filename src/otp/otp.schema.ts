import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, id: true })
export class Otp {
  @Prop({
    required: true,
    match: /^\d{3}-\d{3}-\d{4}$/,
    unique: true,
    index: true,
  })
  phoneNumber: string;

  @Prop({
    required: true,
  })
  otp: string;

  @Prop({
    default: Date.now,
  })
  lastSentTime: Date;
}

const OtpSchema = SchemaFactory.createForClass(Otp);
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 }); // 5 minutes
export type OtpDocument = Otp & Document;
export { OtpSchema };
