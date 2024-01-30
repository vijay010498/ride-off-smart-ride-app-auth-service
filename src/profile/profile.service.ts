import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../common/dtos/update-user.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  updateProfile(id: string, updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
