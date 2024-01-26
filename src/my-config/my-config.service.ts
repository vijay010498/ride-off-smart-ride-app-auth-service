import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyConfigService {
  constructor(private readonly configService: ConfigService) {}

  getMongoUri(): string {
    const URI = this.configService.get<string>('MONGODB_URI_AUTH');
    return URI;
  }

  getMongoDatabase(): string {
    return this.configService.get<string>('MONGO_AUTH_DATABASE');
  }

  getJwtAccessSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET');
  }
}
