import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { UserService } from '../../user/user.service';
export declare class CurrentUserInterceptor implements NestInterceptor {
    private readonly userService;
    constructor(userService: UserService);
    intercept(context: ExecutionContext, next: CallHandler<any>): Promise<import("rxjs").Observable<any>>;
}
