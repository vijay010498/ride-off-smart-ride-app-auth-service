import { Controller, Get, UseInterceptors, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CurrentUserInterceptor } from '../common/interceptors/current-user.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserDocument } from './user.schema';
import { IsBlockedGuard } from '../common/guards/isBlocked.guard';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UserTokens } from '../common/decorators/user-token.decorator';
import { UserTokensDto } from './dtos/user-tokens.dto';
@Controller('user')
@UseInterceptors(CurrentUserInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard, IsBlockedGuard)
  @Get('/logout')
  @Serialize(UserDto)
  logout(
    @CurrentUser() user: any,
    @UserTokens() tokens: Partial<UserTokensDto>,
  ) {
    return this.userService.logout(user.id, tokens.accessToken);
  }
}
