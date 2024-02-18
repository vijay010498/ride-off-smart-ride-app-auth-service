import { VehicleTypeEnum } from '../schemas/user-vehicle.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsEnum(VehicleTypeEnum)
  type: VehicleTypeEnum;

  @ApiProperty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsString()
  year: string;

  @ApiProperty()
  @IsString()
  licensePlate: string;
}
