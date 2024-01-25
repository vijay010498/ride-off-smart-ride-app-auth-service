import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpSchema } from './otp.schema';
import { AwsModule } from '../aws/aws.module';
import { UserModule } from '../user/user.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Otp',
        schema: OtpSchema,
      },
    ]),
    AwsModule,
    UserModule,
    TokenModule,
  ],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
