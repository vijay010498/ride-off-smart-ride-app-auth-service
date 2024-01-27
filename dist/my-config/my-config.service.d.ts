import { ConfigService } from '@nestjs/config';
export declare class MyConfigService {
    private readonly configService;
    constructor(configService: ConfigService);
    getMongoUri(): string;
    getMongoDatabase(): string;
    getJwtAccessSecret(): string;
    getJwtRefreshSecret(): string;
}
