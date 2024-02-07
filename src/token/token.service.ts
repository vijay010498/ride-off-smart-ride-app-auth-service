import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MyConfigService } from '../my-config/my-config.service';
import * as argon2 from 'argon2';
import { UserService } from '../user/user.service';
@Injectable()
export class TokenService {
  private logger = new Logger(TokenService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: MyConfigService,
    private readonly userService: UserService,
  ) {}

  private hashData(data: string) {
    return argon2.hash(data);
  }

  async refreshTokens(user: any, requestRefreshToken: string) {
    try {
      if (!user.refreshToken)
        throw new ForbiddenException('Please Login First');
      const refreshTokenMatches = await argon2.verify(
        user.refreshToken,
        requestRefreshToken,
      );
      if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
      const tokens = await this.getTokens(user.id, user.phoneNumber);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      this.logger.error('refreshTokens-service-error', error);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Server Error');
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    return this.userService.updateRefreshToken(userId, hashedRefreshToken);
  }
  async getTokens(userId: string, phoneNumber: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, phoneNumber },
        {
          secret: this.configService.getJwtAccessSecret(),
          expiresIn: '30d',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, phoneNumber },
        {
          secret: this.configService.getJwtRefreshSecret(),
          expiresIn: '150d',
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
