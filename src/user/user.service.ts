import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUserByPhone(phoneNumber: string) {
    // TODO Implement Service
    return Promise.resolve({ user: phoneNumber });
  }
}
