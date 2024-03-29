import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyConfigService {
  constructor(private readonly configService: ConfigService) {}

  getMongoUri(): string {
    return this.configService.get<string>('MONGODB_URI_AUTH');
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

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  getAWSSNSAccessID(): string {
    return this.configService.get<string>('aws_sns_access_key_id');
  }

  getAWSSNSSecretKey(): string {
    return this.configService.get<string>('aws_sns_secret_access_key');
  }

  getAuthTopicSNSArn(): string {
    return this.configService.get<string>('AUTH_TOPIC_SNS_ARN');
  }

  getAWSSQSAccessID(): string {
    return this.configService.get<string>('aws_sqs_access_key_id');
  }

  getAWSSQSSecretKey(): string {
    return this.configService.get<string>('aws_sqs_secret_access_key');
  }

  getAwsRegion(): string {
    return this.configService.get<string>('aws_region');
  }

  getSqsQueueName(): string {
    return this.configService.get<string>('aws_sqs_queue_name');
  }

  getSqsQueueURL(): string {
    return this.configService.get<string>('aws_sqs_queue_url');
  }
  getAWSS3AccessID(): string {
    return this.configService.get<string>('aws_s3_access_key_id');
  }

  getAWSS3SecretKey(): string {
    return this.configService.get<string>('aws_s3_secret_access_key');
  }

  getAWSS3BucketName(): string {
    return this.configService.get<string>('aws_auth_s3_bucket');
  }
  getTwilioSID(): string {
    return this.configService.get<string>('TWILIO_SID');
  }

  getTwilioAccountSID(): string {
    return this.configService.get<string>('TWILIO_ACCOUNT_SID');
  }
  getTwilioSecret(): string {
    return this.configService.get<string>('TWILIO_SECRET');
  }
  getTwilioNumber(): string {
    return this.configService.get<string>('TWILIO_NUMBER');
  }
}
