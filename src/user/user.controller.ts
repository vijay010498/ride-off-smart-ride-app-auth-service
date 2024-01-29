import { Controller, Get, UseInterceptors, UseGuards, Param, NotFoundException, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CurrentUserInterceptor } from '../common/interceptors/current-user.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsBlockedGuard } from '../common/guards/isBlocked.guard';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { UserTokens } from '../common/decorators/user-token.decorator';
import { UserTokensDto } from './dtos/user-tokens.dto';
import { TokenBlacklistGuard } from '../common/guards/tokenBlacklist.guard';
@Controller('user')
@UseInterceptors(CurrentUserInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO - Implement Signup Post API

 


  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard) // TODO remove TokenBlacklistGuard if not needed for logout
  @Get('/logout')
  @Serialize(UserDto)
  logout(
    @CurrentUser() user: any,
    @UserTokens() tokens: Partial<UserTokensDto>,
  ) {
    return this.userService.logout(user.id, tokens.accessToken);
  }
  
   // TODO - Implement current user GET APi
  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard) 
  @Get('/details')
  @Serialize(UserDto)
  details(
    @CurrentUser() user: any
  ) {
    return user;
  }

}
