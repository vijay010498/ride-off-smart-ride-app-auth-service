import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CurrentUserInterceptor } from '../common/interceptors/current-user.interceptor';
import { TokenService } from './token.service';
import { IsBlockedGuard } from '../common/guards/isBlocked.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserTokens } from '../common/decorators/user-token.decorator';
import { UserTokensDto } from '../common/dtos/user-tokens.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshTokenResponseDto } from './dtos/refresh-token-response.dto';

@ApiTags('TOKEN')
@ApiBearerAuth()
@Controller('token')
@ApiForbiddenResponse({
  description: 'Refresh token is not Valid / User is blocked',
})
@UseInterceptors(CurrentUserInterceptor)
@UseGuards(RefreshTokenGuard, IsBlockedGuard)
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('/refresh')
  @ApiOkResponse({
    description: 'New Tokens generated',
    type: RefreshTokenResponseDto,
  })
  refreshToken(
    @CurrentUser() user: any,
    @UserTokens() tokens: Partial<UserTokensDto>,
  ) {
    return this.tokenService.refreshTokens(user, tokens.requestRefreshToken);
  }
}
