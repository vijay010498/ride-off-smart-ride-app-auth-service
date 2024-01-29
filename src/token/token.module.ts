import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { MyConfigModule } from '../my-config/my-config.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MyConfigModule, JwtModule.register({}), UserModule],
  controllers: [TokenController],
  providers: [TokenService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [TokenService],
})
export class TokenModule {}
