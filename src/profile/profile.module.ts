import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [UserService],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
