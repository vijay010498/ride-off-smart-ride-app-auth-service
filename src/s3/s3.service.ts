import { Injectable, Logger } from '@nestjs/common';
import {
  PutObjectCommand,
  S3Client,
  DeleteObjectsCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { MyConfigService } from '../my-config/my-config.service';
import mongoose from 'mongoose';

@Injectable()
export class S3Service {
  private readonly S3: S3Client;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: MyConfigService) {
    this.S3 = new S3Client({
      apiVersion: 'latest',
      region: this.configService.getAwsRegion(),
      credentials: {
        accessKeyId: this.configService.getAWSS3AccessID(),
        secretAccessKey: this.configService.getAWSS3SecretKey(),
      },
    });
  }

  private async _uploadFile(key: string, fileContent: Buffer) {
    try {
      const uploadCommand = new PutObjectCommand({
        Bucket: this.configService.getAWSS3BucketName(),
        Key: key,
        Body: fileContent,
      });
      await this.S3.send(uploadCommand);
      const s3URI = `s3://${this.configService.getAWSS3BucketName()}/${key}`;
      const objectURL = `https://${this.configService.getAWSS3BucketName()}.s3.${this.configService.getAwsRegion()}.amazonaws.com/${key}`;
      return {
        s3URI,
        imageURL: objectURL,
      };
    } catch (error) {
      this.logger.error(`Error uploading file to S3`, error);
      throw error;
    }
  }

  async uploadVehicleImages(
    userId: mongoose.Types.ObjectId,
    vehicleImages: Buffer[],
    vehicleId: mongoose.Types.ObjectId,
  ) {
    return Promise.all(
      vehicleImages.map((image, index) => {
        const imageKey = `${userId}/vehicles/${vehicleId}/images/image-${index}.jpg`;
        return this._uploadFile(imageKey, image);
      }),
    );
  }

  async deleteVehicleImages(
    userId: mongoose.Types.ObjectId,
    vehicleId: mongoose.Types.ObjectId,
  ) {
    try {
      const prefix = `${userId}/vehicles/${vehicleId}/images/`;
      const listObjectsCommand = {
        Bucket: this.configService.getAWSS3BucketName(),
        Prefix: prefix,
      };
      const { Contents } = await this.S3.send(
        new ListObjectsCommand(listObjectsCommand),
      );

      if (Contents && Contents.length > 0) {
        const objectsToDelete = Contents.map(({ Key }) => ({ Key }));
        const deleteCommandRequest = {
          Bucket: this.configService.getAWSS3BucketName(),
          Delete: { Objects: objectsToDelete },
        };

        await this.S3.send(new DeleteObjectsCommand(deleteCommandRequest));
        this.logger.log('Deleted all objects inside the "images" folder');
      } else {
        this.logger.log(
          'No objects found to delete inside the "images" folder',
        );
      }
    } catch (error) {
      this.logger.error(
        'Error deleting objects inside the "images" folder',
        error,
      );
      throw error;
    }
  }
}
