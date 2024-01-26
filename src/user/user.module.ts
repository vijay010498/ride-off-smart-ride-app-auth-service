import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { CurrentUserInterceptor } from '../common/interceptors/current-user.interceptor';
import { UserTokenBlacklistSchema } from './user-token-blacklist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'UserTokenBlacklist',
        schema: UserTokenBlacklistSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, CurrentUserInterceptor],
  exports: [UserService],
})
export class UserModule {}
