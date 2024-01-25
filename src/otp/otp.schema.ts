import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
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
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 }); // 5 minutes TODO update to required time later
export type OtpDocument = Otp & Document;
export { OtpSchema };
