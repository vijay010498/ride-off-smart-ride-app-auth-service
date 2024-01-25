import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';
import { UpdateRefreshTokenDto } from './dtos/update-refresh-token.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userCollection: Model<UserDocument>,
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
  update(id: string, updateUserDto: UpdateRefreshTokenDto | UpdateUserDto) {
    return this.userCollection
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }
}
