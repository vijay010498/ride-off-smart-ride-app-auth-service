"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const otp_module_1 = require("./otp/otp.module");
const user_module_1 = require("./user/user.module");
const token_module_1 = require("./token/token.module");
const location_module_1 = require("./location/location.module");
const profile_module_1 = require("./profile/profile.module");
const my_config_module_1 = require("./my-config/my-config.module");
const mongoose_1 = require("@nestjs/mongoose");
const my_config_service_1 = require("./my-config/my-config.service");
const config_1 = require("@nestjs/config");
const aws_module_1 = require("./aws/aws.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            my_config_module_1.MyConfigModule,
            mongoose_1.MongooseModule.forRootAsync({
                imports: [my_config_module_1.MyConfigModule],
                useFactory: (configService) => ({
                    uri: configService.getMongoUri(),
                    dbName: configService.getMongoDatabase(),
                    autoIndex: true,
                }),
                inject: [my_config_service_1.MyConfigService],
            }),
            otp_module_1.OtpModule,
            user_module_1.UserModule,
            token_module_1.TokenModule,
            location_module_1.LocationModule,
            profile_module_1.ProfileModule,
            aws_module_1.AwsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map