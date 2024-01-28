import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { UpdateTokensDto } from './dtos/update-tokens.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserTokenBlacklistDocument } from './user-token-blacklist.schema';
import { SignUpDto } from './dtos/sign-up.dto';
import { AwsService } from '../aws/aws.service';

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

      // TODO check how to give event in aws Service function
      // SEND EVENT  TO THE AUTH SNS
      const snsMessage = Object.assign(
        {},
        { user },
        { EVENT_TYPE: 'USER_CREATED_BY_PHONE' },
      );
      // TODO DO ASYNC
      await this.awsService.publishToAuthTopicSNS(JSON.stringify(snsMessage));
      return user;
    } catch (createUserByPhone) {
      if (createUserByPhone.code && createUserByPhone.code === 'SNS_ERROR') {
        this.logger.error('Error in publish event to SNS');
      } else {
        this.logger.error('Error in Creating User By phone', createUserByPhone);
      }
      throw new Error('Error in createUserByPhone');
    }
  }

  async findById(id: string) {
    return this.userCollection.findById(id);
  }
  update(
    id: string,
    updateUserDto:
      | UpdateTokensDto
      | UpdateUserDto
      | Partial<UpdateUserDto>
      | SignUpDto,
  ) {
    return this.userCollection
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }
  signUp(id: string, signupDto: SignUpDto) {
    return this.update(id, signupDto);
  }

  async logout(userId: string, accessToken: string) {
    await this.update(userId, { refreshToken: null });
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
}
