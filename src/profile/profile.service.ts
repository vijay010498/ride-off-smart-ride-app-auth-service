import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/dtos/update-user.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly userService: UserService) {}

  // TODO create updateProfile function - use userService -> Update to update the user profile (email, firstname,...) - create necessary Dtos - if Dtos being used in multiple modules create in common dto
  updateProfile(id: string, updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
}
