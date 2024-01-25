import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpSchema } from './otp.schema';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Otp',
        schema: OtpSchema,
      },
    ]),
    AwsModule,
  ],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
