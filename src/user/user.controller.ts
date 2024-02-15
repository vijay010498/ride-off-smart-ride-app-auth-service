import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  ConflictException,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CurrentUserInterceptor } from '../common/interceptors/current-user.interceptor';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsBlockedGuard } from '../common/guards/isBlocked.guard';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { UserDto } from '../common/dtos/user.dto';
import { UserTokens } from '../common/decorators/user-token.decorator';
import { UserTokensDto } from '../common/dtos/user-tokens.dto';
import { TokenBlacklistGuard } from '../common/guards/tokenBlacklist.guard';
import { SignUpDto } from './dtos/sign-up.dto';
import { UpdateUserLocationDto } from './dtos/update-user-location.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('USER')
@ApiForbiddenResponse({
  description: 'User is blocked',
})
@ApiUnauthorizedResponse({
  description: 'Invalid Token',
})
@ApiBadRequestResponse({
  description: 'User Does not exist',
})
@Controller('user')
@UseInterceptors(CurrentUserInterceptor)
@UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard)
@Serialize(UserDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiConflictResponse({
    description: 'User is already signed up',
  })
  @ApiCreatedResponse({
    description: 'User Signed Up',
    type: UserDto,
  })
  @Post('/signup')
  signup(@Body() body: SignUpDto, @CurrentUser() user: any) {
    // TODO move checking signedUp logic to service in future
    // User is already signed-up
    if (user.signedUp) {
      throw new ConflictException('User is already signed up');
    }
    return this.userService.signUp(user.id, body);
  }

  @ApiNoContentResponse({
    description: 'Logout an User',
  })
  @Get('/logout')
  logout(
    @CurrentUser() user: any,
    @UserTokens() tokens: Partial<UserTokensDto>,
  ) {
    return this.userService.logout(user.id, tokens.accessToken);
  }

  @ApiNoContentResponse({
    description: 'Update User Current Location',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('/location')
  updateLocation(
    @Body() location: UpdateUserLocationDto,
    @CurrentUser() user: any,
  ) {
    this.userService.updateUserLocation(user.id, location);
    return;
  }

  @ApiOkResponse({
    description: 'Get Current User',
    type: UserDto,
  })
  @Get('')
  details(@CurrentUser() user: any) {
    return user;
  }
}
