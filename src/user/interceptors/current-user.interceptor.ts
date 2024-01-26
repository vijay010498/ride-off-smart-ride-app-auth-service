import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const userId = request.user['sub'] || {};

    if (userId) {
      const user = await this.userService.findById(userId);
      request.currentuser = user;
    }
    //
    // console.log('CurrentUserInterceptor', userId);
    // console.log('currentuser', request.currentuser);

    return next.handle();
  }
}
