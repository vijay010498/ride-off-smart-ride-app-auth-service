import { Controller, Get, UseInterceptors, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller('user')
@UseInterceptors(CurrentUserInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  logout() {
    return 'logout-called';
  }
}
