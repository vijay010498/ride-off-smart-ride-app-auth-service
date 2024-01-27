import { Controller, Get, Post, Body, UseInterceptors, UseGuards, Response } from '@nestjs/common';
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
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('user')
@UseInterceptors(CurrentUserInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard)
  @Post('/signup')
  signup(@Body() body: SignUpDto, @CurrentUser() user: any, @Response() res){
    if(user && user.signedUp){
      return res.status(409).json({ successful: "false", message: "User is already signed up" });
    }

    body.signedUp = true;

    this.userService.update(user.id, body);   

    return res.status(201).json({ successful: "true", message: "Signed up successfully" });
  }


  // TODO - Implement current user GET APi
  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard) // TODO remove TokenBlacklistGuard if not needed for logout
  @Get('/logout')
  @Serialize(UserDto)
  logout(
    @CurrentUser() user: any,
    @UserTokens() tokens: Partial<UserTokensDto>,
  ) {
    return this.userService.logout(user.id, tokens.accessToken);
  }
}
