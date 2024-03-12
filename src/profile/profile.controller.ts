import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnprocessableEntityException,
  UploadedFiles,
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
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from './ImageFileFilter';
import { VehicleImagesDto } from './dtos/vehicle-images.dto';
import { VehicleTypeEnum } from './schemas/user-vehicle.schema';
import { VehicleDto } from './dtos/vehicle.dto';
import { DeleteVehicleDto } from './dtos/delete-vehicle.dto';

@ApiBearerAuth()
@ApiTags('PROFILE')
@ApiForbiddenResponse({
  description: 'User is blocked',
})
@ApiUnauthorizedResponse({
  description: 'Invalid Token',
})
@ApiBadRequestResponse({
  description: 'User Does not exist',
})
@Controller('profile')
@UseInterceptors(CurrentUserInterceptor)
@UseGuards(AccessTokenGuard, IsBlockedGuard, TokenBlacklistGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Vehicles
  @Get('/vehicle/types')
  @ApiOperation({
    summary: 'Get Available Vehicle Types',
  })
  @ApiResponse({
    type: [String],
  })
  getSupportedVehicleTypes() {
    return Object.values(VehicleTypeEnum);
  }

  @Post('/vehicle')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Creates New Vehicle for user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        vehicleImages: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          maximum: 5,
          description:
            'Array of image files (only .jpg or .jpeg files allowed) - Max 5 Images',
        },
        model: {
          type: 'string',
          description: 'Vehicle Model',
        },
        type: {
          type: 'string',
          description: 'Vehicle Type',
        },
        color: {
          type: 'string',
          description: 'Vehicle Color',
        },
        year: {
          type: 'string',
          description: 'Vehicle Year',
        },
        licensePlate: {
          type: 'string',
          description: 'Vehicle LicensePlate',
        },
        averageKmPerLitre: {
          type: 'string',
          description: 'Average KM per Liter',
        },
      },
      required: [
        'vehicleImages',
        'model',
        'type',
        'color',
        'year',
        'licensePlate',
        'averageKmPerLitre',
      ],
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'vehicleImages',
          maxCount: 5,
        },
      ],
      {
        limits: {
          fileSize: 50 * 1024 * 1024, // 50 MB
        },
        fileFilter: new ImageFileFilter().fileFilter.bind(
          new ImageFileFilter(),
        ),
      },
    ),
  )
  @ApiInternalServerErrorResponse({
    description: 'Error Creating New Vehicle, Please try again later',
  })
  @ApiCreatedResponse({
    description: 'New Vehicle Created',
    type: VehicleDto,
  })
  @Serialize(VehicleDto)
  createNewVehicle(
    @Body() body: CreateVehicleDto,
    @UploadedFiles() files: VehicleImagesDto,
    @CurrentUser() user: any,
  ) {
    if (!files || !files.vehicleImages || !files.vehicleImages.length) {
      throw new BadRequestException('At-least One Vehicle Image is required');
    }

    return this.profileService.createNewUserVehicle(
      user.id,
      body,
      files.vehicleImages,
    );
  }

  @Get('/vehicles')
  @ApiOperation({
    summary: 'Get User Vehicles',
  })
  @ApiResponse({
    type: [VehicleDto],
  })
  @Serialize(VehicleDto)
  getUserVehicles(@CurrentUser() user: any) {
    return this.profileService.getUserVehicles(user.id);
  }

  @Delete('/vehicle/:id')
  @ApiOperation({
    summary: 'Delete a given User Vehicle',
  })
  @ApiResponse({
    description: 'Vehicle Deleted',
    type: VehicleDto,
  })
  @ApiBadRequestResponse({
    description: 'Vehicle Not Found',
  })
  @ApiParam({
    name: 'id',
    description: 'Vehicle ID',
    type: String,
  })
  @Serialize(VehicleDto)
  deleteVehicle(@Param() params: DeleteVehicleDto, @CurrentUser() user: any) {
    return this.profileService.deleteUserVehicle(params.id, user.id);
  }

  // Update Profile
  @Put('')
  @ApiOperation({
    summary: 'Update User Profile',
  })
  @ApiUnprocessableEntityResponse({
    description: 'User is not signed up',
  })
  @ApiCreatedResponse({
    description: 'User Profile Updated',
    type: UserDto,
  })
  @Serialize(UserDto)
  updateProfile(@Body() body: UpdateUserDto, @CurrentUser() user: any) {
    if (!user.signedUp) {
      throw new UnprocessableEntityException('User is not signed up');
    }
    return this.profileService.updateProfile(user.id, body);
  }
}
