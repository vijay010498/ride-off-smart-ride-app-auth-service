import {
  Body,
  ConflictException,
  Controller,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CurrentUserInterceptor } from 'src/common/interceptors/current-user.interceptor';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from 'src/user/dtos/user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IsBlockedGuard } from 'src/common/guards/isBlocked.guard';
import { TokenBlacklistGuard } from 'src/common/guards/tokenBlacklist.guard';
import { UpdateUserDto } from 'src/user/dtos/update-user.dto';

@Controller('profile')
@UseInterceptors(CurrentUserInterceptor)
@Serialize(UserDto)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard)
  @Patch('/update')
  updateProfile(@CurrentUser() user: any, @Body() body: UpdateUserDto) {
    if (!user.SignedUp) {
      throw new ConflictException('User is not signed up');
    }
    return this.profileService.updateProfile(user.id, body);
  }
}
