import { Injectable, Logger } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { MyConfigService } from '../my-config/my-config.service';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);
  private readonly SNS: SNSClient;

  constructor(private readonly configService: MyConfigService) {
    this.SNS = new SNSClient({
      apiVersion: 'latest',
      region: 'ca-central-1',
      credentials: {
        accessKeyId: this.configService.getAWSSNSAccessID(),
        secretAccessKey: this.configService.getAWSSNSSecretKey(),
      },
    });
  }

  async sendOtpToPhone(phoneNumber: string, OTP: string) {
    const MESSAGE = `Your verification code is ${OTP}, expires in 5 Minutes - Smart Ride App`;
    const smsParams = {
      Message: MESSAGE,
      PhoneNumber: `+1${phoneNumber}`,
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          DataType: 'String',
          StringValue: 'RideOff',
        },
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional',
        },
      },
    };
    try {
      const { MessageId } = await this.SNS.send(new PublishCommand(smsParams));
      this.logger.log('Otp Sent Successfully Message-ID', MessageId);
    } catch (sendOtpToPhoneError) {
      this.logger.error('sendOtpToPhoneError', sendOtpToPhoneError);
      throw sendOtpToPhoneError;
    }
  }

  async publishToAuthTopicSNS(Message: string) {
    try {
      const messageParams = {
        Message,
        TopicArn: this.configService.getAuthTopicSNSArn(),
      };

      const { MessageId } = await this.SNS.send(
        new PublishCommand(messageParams),
      );

      this.logger.log('publishToAuthTopicSNS-success', MessageId);
    } catch (publishToAuthTopicSNSError) {
      this.logger.error(
        'publishToAuthTopicSNSError',
        publishToAuthTopicSNSError,
      );
      throw Object.assign(new Error('Error in publishToAuthTopicSNS'), {
        code: 'SNS_ERROR',
      });
    }
  }
}
