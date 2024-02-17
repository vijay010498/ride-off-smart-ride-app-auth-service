import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserVehicleSchema } from './schemas/user-vehicle.schema';
import { S3Module } from '../s3/s3.module';
import { SnsModule } from '../sns/sns.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'UserVehicle',
        schema: UserVehicleSchema,
      },
    ]),
    UserModule,
    S3Module,
    SnsModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
