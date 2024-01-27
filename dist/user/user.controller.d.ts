import { UserService } from './user.service';
import { UserTokensDto } from './dtos/user-tokens.dto';
import { SignUpDto } from './dtos/sign-up.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signup(body: SignUpDto, user: any, res: any): any;
    logout(user: any, tokens: Partial<UserTokensDto>): Promise<void>;
}
