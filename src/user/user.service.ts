import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { UpdateTokensDto } from './dtos/update-tokens.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserTokenBlacklistDocument } from './user-token-blacklist.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userCollection: Model<UserDocument>,
    @InjectModel('UserTokenBlacklist')
    private readonly UserTokenBlacklistCollection: Model<UserTokenBlacklistDocument>,
  ) {}
  async getUserByPhone(phoneNumber: string) {
    const user = await this.userCollection.findOne({
      phoneNumber,
    });
    return user;
  }

  createUserByPhone(phoneNumber: string) {
    const user = new this.userCollection({ phoneNumber });
    return user.save();
  }

  async findById(id: string) {
    return this.userCollection.findById(id);
  }
  update(
    id: string,
    updateUserDto:
      | Partial<UpdateTokensDto>
      | UpdateTokensDto
      | UpdateUserDto
      | Partial<UpdateUserDto>,
  ) {
    return this.userCollection
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async logout(userId: string, accessToken: string) {
    await this.update(userId, { refreshToken: null });
    const blackListToken = new this.UserTokenBlacklistCollection({
      token: accessToken,
    });

    await blackListToken.save();
  }
}
