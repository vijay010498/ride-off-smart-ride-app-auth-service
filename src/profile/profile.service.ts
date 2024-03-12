import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../common/dtos/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { S3Service } from '../s3/s3.service';
import {
  UserVehicle,
  UserVehicleDocument,
} from './schemas/user-vehicle.schema';
import { SnsService } from '../sns/sns.service';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);
  constructor(
    @InjectModel('UserVehicle')
    private readonly userVehicleCollection: Model<UserVehicleDocument>,
    private readonly userService: UserService,
    private readonly s3: S3Service,
    private readonly sns: SnsService,
  ) {}

  updateProfile(id: string, updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  async createNewUserVehicle(
    userId: mongoose.Types.ObjectId,
    data: CreateVehicleDto,
    vehicleImages: Express.Multer.File[],
  ) {
    try {
      // step - 1 Upload vehicle Images
      const vehicleId = new mongoose.Types.ObjectId();
      const imagesBuffer = vehicleImages.map((image) => image.buffer);
      const uploadImagesResponses: { s3URI: string; imageURL: string }[] =
        await this.s3.uploadVehicleImages(userId, imagesBuffer, vehicleId);
      const vehicleImagesS3URIs: string[] = [];
      const vehicleImagesObjectURLs: string[] = [];

      uploadImagesResponses.forEach(({ s3URI, imageURL }) => {
        vehicleImagesS3URIs.push(s3URI);
        vehicleImagesObjectURLs.push(imageURL);
      });

      // step - 2 create new user vehicle into collection and return vehicle
      return this._createNewVehicleWithGivenId(vehicleId, {
        color: data.color,
        licensePlate: data.licensePlate,
        model: data.model,
        type: data.type,
        userId,
        vehicleImagesObjectURLs,
        vehicleImagesS3URIs,
        year: data.year,
        averageKmPerLitre: parseInt(data.averageKmPerLitre),
      });
    } catch (error) {
      this.logger.error('createNewUserVehicle-error', error);
      throw new InternalServerErrorException(
        'Error Creating New Vehicle, Please try again later',
      );
    }
  }

  private async _createNewVehicleWithGivenId(
    vehicleId: mongoose.Types.ObjectId,
    vehicleObject: UserVehicle,
  ) {
    const vehicle = new this.userVehicleCollection({
      _id: vehicleId,
      ...vehicleObject,
    });
    await vehicle.save();

    // SNS Event
    this.sns.newVehicleCreatedEvent(vehicle);

    return vehicle;
  }

  async getUserVehicles(userId: mongoose.Types.ObjectId) {
    return this.userVehicleCollection.find({
      userId,
    });
  }

  async deleteUserVehicle(
    vehicleId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ) {
    const deletedVehicle = await this.userVehicleCollection.findOneAndDelete({
      _id: vehicleId,
      userId,
    });

    if (!deletedVehicle) throw new BadRequestException('Vehicle Not Found');

    // Delete Vehicle Images
    await this.s3.deleteVehicleImages(userId, vehicleId);

    // SNS Event
    if (deletedVehicle) this.sns.vehicleDeletedEvent(deletedVehicle);

    return deletedVehicle;
  }
}
