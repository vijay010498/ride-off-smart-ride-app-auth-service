import { Controller, Get, UseInterceptors, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CurrentUserInterceptor } from '../common/interceptors/current-user.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './user.schema';
import { IsBlockedGuard } from '../common/guards/isBlocked.guard';
@Controller('user')
@UseInterceptors(CurrentUserInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard, IsBlockedGuard)
  @Get('/logout')
  logout(@CurrentUser() user: Partial<User>) {
    return user;
  }
}
