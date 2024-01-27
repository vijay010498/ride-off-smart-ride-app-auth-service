import { JwtService } from '@nestjs/jwt';
import { MyConfigService } from '../my-config/my-config.service';
import { UserService } from '../user/user.service';
export declare class TokenService {
    private readonly jwtService;
    private readonly configService;
    private readonly userService;
    constructor(jwtService: JwtService, configService: MyConfigService, userService: UserService);
    private hashData;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    getTokens(userId: string, phoneNumber: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
