import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeoJSONType, UserDocument, LastLocation } from './user.schema';
import { UpdateTokensDto } from './dtos/update-tokens.dto';
import { UpdateUserDto } from '../common/dtos/update-user.dto';
import { UserTokenBlacklistDocument } from './user-token-blacklist.schema';
import { SignUpDto } from './dtos/sign-up.dto';
import { AwsService } from '../aws/aws.service';
import { UpdateUserLocationDto } from './dtos/update-user-location.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(AwsService.name);

  constructor(
    @InjectModel('User') private readonly userCollection: Model<UserDocument>,
    @InjectModel('UserTokenBlacklist')
    private readonly UserTokenBlacklistCollection: Model<UserTokenBlacklistDocument>,
    private readonly awsService: AwsService,
  ) {}

  async getUserByPhone(phoneNumber: string) {
    const user = await this.userCollection.findOne({
      phoneNumber,
    });
    return user;
  }

  async createUserByPhone(phoneNumber: string) {
    try {
      const user = new this.userCollection({ phoneNumber });
      await user.save(); // user is saved into DB by phoneNumber

      // No need of await since we don't need to wait
      // SNS event
      this.awsService.userCreatedByPhoneEvent(user);
      return user;
    } catch (createUserByPhone) {
      this.logger.error('Error in Creating User By phone', createUserByPhone);
    }
  }

  async findById(id: string) {
    return this.userCollection.findById(id);
  }

  private async _update(
    id: string,
    updateUserDto:
      | UpdateTokensDto
      | UpdateUserDto
      | Partial<UpdateUserDto>
      | SignUpDto
      | LastLocation,
  ) {
    return this.userCollection
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async updateRefreshToken(userId: string, refreshToken: string = null) {
    return this._update(userId, { refreshToken });
  }

  signUp(id: string, signupDto: SignUpDto) {
    return this._update(id, signupDto);
  }

  updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    return this._update(userId, updateUserDto);
  }

  async logout(userId: string, accessToken: string) {
    await this._update(userId, { refreshToken: null });
    const blackListToken = new this.UserTokenBlacklistCollection({
      token: accessToken,
    });

    await blackListToken.save();
  }

  async tokenInBlackList(accessToken: string) {
    return this.UserTokenBlacklistCollection.findOne({
      token: accessToken,
    });
  }

  async updateUserLocation(userId: string, location: UpdateUserLocationDto) {
    const updateUserLocationDto: LastLocation = {
      lastLocation: {
        type: GeoJSONType.Point,
        coordinates: [location.longitude, location.latitude],
      },
    };
    return this._update(userId, updateUserLocationDto);
  }
}
