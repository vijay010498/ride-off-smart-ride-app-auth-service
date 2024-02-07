import {
  BadRequestException,
  Body,
  Controller,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CurrentUserInterceptor } from 'src/common/interceptors/current-user.interceptor';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from 'src/common/dtos/user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { IsBlockedGuard } from 'src/common/guards/isBlocked.guard';
import { TokenBlacklistGuard } from 'src/common/guards/tokenBlacklist.guard';
import { UpdateUserDto } from 'src/common/dtos/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('PROFILE')
@Controller('profile')
@UseInterceptors(CurrentUserInterceptor)
@Serialize(UserDto)
@UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBadRequestResponse({
    description: 'User is not signed up',
  })
  @ApiCreatedResponse({
    description: 'User Profile Updated',
    type: UserDto,
  })
  @Put('')
  updateProfile(@Body() body: UpdateUserDto, @CurrentUser() user: any) {
    if (!user.signedUp) {
      throw new BadRequestException('User is not signed up');
    }
    return this.profileService.updateProfile(user.id, body);
  }
}
