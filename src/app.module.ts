import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OtpModule } from './otp/otp.module';
import { UserModule } from './user/user.module';
import { TokenModule } from './token/token.module';
import { LocationModule } from './location/location.module';
import { ProfileModule } from './profile/profile.module';
import { MyConfigModule } from './my-config/my-config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MyConfigService } from './my-config/my-config.service';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './aws/aws.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    DevtoolsModule.registerAsync({
      imports: [MyConfigModule],
      useFactory: (configService: MyConfigService) => ({
        http: configService.getNodeEnv() !== 'production',
      }),
      inject: [MyConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [MyConfigModule],
      useFactory: (configService: MyConfigService) => ({
        uri: configService.getMongoUri(),
        dbName: configService.getMongoDatabase(),
        autoIndex: true,
      }),
      inject: [MyConfigService],
    }),
    OtpModule,
    UserModule,
    TokenModule,
    LocationModule,
    ProfileModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
