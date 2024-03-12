import { VehicleTypeEnum } from '../schemas/user-vehicle.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(VehicleTypeEnum)
  type: VehicleTypeEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({
    description: 'Average Km Per Liter',
  })
  @IsString()
  @IsNotEmpty()
  averageKmPerLitre: string;
}
