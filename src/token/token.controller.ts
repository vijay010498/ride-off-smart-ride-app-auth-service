import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUserInterceptor } from '../common/interceptors/current-user.interceptor';
import { TokenService } from './token.service';
import { IsBlockedGuard } from '../common/guards/isBlocked.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserTokens } from '../common/decorators/user-token.decorator';
import { UserTokensDto } from '../common/dtos/user-tokens.dto';

@Controller('token')
@UseInterceptors(CurrentUserInterceptor)
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @UseGuards(RefreshTokenGuard, IsBlockedGuard)
  @Get('/refresh')
  refreshToken(
    @CurrentUser() user: any,
    @UserTokens() tokens: Partial<UserTokensDto>,
  ) {
    return this.tokenService.refreshTokens(user, tokens.requestRefreshToken);
  }
}
