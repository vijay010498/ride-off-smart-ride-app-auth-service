import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CurrentUserInterceptor } from '../common/interceptors/current-user.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsBlockedGuard } from '../common/guards/isBlocked.guard';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UserTokens } from '../common/decorators/user-token.decorator';
import { UserTokensDto } from '../common/dtos/user-tokens.dto';
import { TokenBlacklistGuard } from '../common/guards/tokenBlacklist.guard';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('user')
@UseInterceptors(CurrentUserInterceptor)
@Serialize(UserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard)
  @Post('/signup')
  signup(@Body() body: SignUpDto, @CurrentUser() user: any) {
    // TODO move checking signedUp logic to service in future
    // User is already signed-up
    if (user.signedUp) {
      throw new ConflictException('User is already signed up');
    }
    return this.userService.signUp(user.id, body);
  }

  // TODO - Implement current user GET APi
  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard) // TODO remove TokenBlacklistGuard if not needed for logout
  @Get('/logout')
  logout(
    @CurrentUser() user: any,
    @UserTokens() tokens: Partial<UserTokensDto>,
  ) {
    return this.userService.logout(user.id, tokens.accessToken);
  }
}
