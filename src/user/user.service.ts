import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.schema';

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
}
