import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { rethrow } from '@nestjs/core/helpers/rethrow';

@Injectable()
export class IsBlockedGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const userId = request.user?.sub;

      if (!userId) return false;

      const user = await this.userService.findById(userId);

      if (!user) throw new BadRequestException('User Does not exist');
      if (user.isBlocked)
        throw new ForbiddenException(
          'User is Blocked, Please Send Email to contact@smartride.io',
        );
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) rethrow(error);
      console.error('Error in IsBlockedGuard:', error);
      return false;
    }
  }
}
