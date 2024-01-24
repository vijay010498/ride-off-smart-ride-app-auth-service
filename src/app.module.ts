import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpModule } from './otp/otp.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { LocationModule } from './location/location.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [OtpModule, UserModule, TokenModule, LocationModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
