import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserVehicleSchema } from './schemas/user-vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'UserVehicle',
        schema: UserVehicleSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
