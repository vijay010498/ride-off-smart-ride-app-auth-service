import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { GeoJSONType, UserDocument, LastLocation } from './user.schema';
import { UpdateTokensDto } from './dtos/update-tokens.dto';
import { UpdateUserDto } from '../common/dtos/update-user.dto';
import { UserTokenBlacklistDocument } from './user-token-blacklist.schema';
import { SignUpDto } from './dtos/sign-up.dto';
import { UpdateUserLocationDto } from './dtos/update-user-location.dto';
import { SnsService } from '../sns/sns.service';
import { UserFaceVerifiedDto } from './dtos/user-face-verified.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel('User') private readonly userCollection: Model<UserDocument>,
    @InjectModel('UserTokenBlacklist')
    private readonly UserTokenBlacklistCollection: Model<UserTokenBlacklistDocument>,
    private readonly snsService: SnsService,
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
      this.snsService.userCreatedByPhoneEvent(user);
      return user;
    } catch (createUserByPhone) {
      this.logger.error('Error in Creating User By phone', createUserByPhone);
    }
  }

  async findById(id: string) {
    return this.userCollection.findById(id);
  }

  private async _update(
    id: string | mongoose.Types.ObjectId,
    updateUserDto:
      | UpdateTokensDto
      | UpdateUserDto
      | UserFaceVerifiedDto
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

  async signUp(id: string, signupDto: SignUpDto) {
    const updatedUser: UserDocument = await this._update(id, signupDto);

    // No need of await since we don't need to wait
    // SNS event
    this.snsService.userUpdatedEvent(updatedUser);

    return updatedUser;
  }

  // Update User - Used in Profile Service
  async updateProfile(
    userId: string | mongoose.Types.ObjectId,
    updateUserDto: UpdateUserDto | Partial<UserDocument>,
  ) {
    const updatedUser = await this._update(userId, updateUserDto);

    // No need of await since we don't need to wait
    // SNS event
    this.snsService.userUpdatedEvent(updatedUser);
    return updatedUser;
  }

  async logout(userId: string, accessToken: string) {
    await this._update(userId, { refreshToken: null });
    const blackListToken = new this.UserTokenBlacklistCollection({
      token: accessToken,
    });

    await blackListToken.save();
    // SNS event
    this.snsService.tokenBlackListEvent(accessToken);
  }

  async tokenInBlackList(accessToken: string) {
    const tokenInBlackList = await this.UserTokenBlacklistCollection.findOne({
      token: accessToken,
    });
    return tokenInBlackList;
  }

  async updateUserLocation(userId: string, location: UpdateUserLocationDto) {
    const updateUserLocationDto: LastLocation = {
      lastLocation: {
        type: GeoJSONType.Point,
        coordinates: [location.longitude, location.latitude],
      },
    };
    const updatedUser = await this._update(userId, updateUserLocationDto);
    // No need of await since we don't need to wait
    // SNS event
    this.snsService.userUpdatedEvent(updatedUser);
    return updatedUser;
  }

  async userFaceVerified(
    userId: string,
    verificationId: mongoose.Types.ObjectId,
  ) {
    const userFaceVerifiedDto: UserFaceVerifiedDto = {
      faceIdVerified: true,
      faceVerificationId: verificationId,
    };

    const updatedUser = await this._update(userId, userFaceVerifiedDto);

    // SNS event
    this.snsService.userUpdatedEvent(updatedUser);

    return updatedUser;
  }
}
