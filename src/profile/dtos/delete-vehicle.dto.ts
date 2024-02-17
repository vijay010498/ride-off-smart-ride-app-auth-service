import { IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class DeleteVehicleDto {
  @IsMongoId({ message: 'Invalid vehicle ID format' })
  id: mongoose.Types.ObjectId;
}
