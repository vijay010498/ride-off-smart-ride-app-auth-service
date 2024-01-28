import { Injectable, Logger } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { MyConfigService } from '../my-config/my-config.service';
import { UserDocument } from '../user/user.schema';

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
    }
  }

  private async _publishToAuthTopicARN(Message: string) {
    try {
      const messageParams = {
        Message,
        TopicArn: this.configService.getAuthTopicSNSArn(),
      };

      const { MessageId } = await this.SNS.send(
        new PublishCommand(messageParams),
      );
      this.logger.log('publishToAuthTopicSNS-success', MessageId);
    } catch (_publishToAuthTopicARNError) {
      this.logger.error(
        'publishToAuthTopicSNSError',
        _publishToAuthTopicARNError,
      );
    }
  }

  async userCreatedByPhoneEvent(
    user: UserDocument,
    EVENT_TYPE: string = 'USER_CREATED_BY_PHONE',
  ) {
    // {"user":{"phoneNumber":"437-556-4035","signedUp":false,"isBlocked":false,"faceIdVerified":false,"_id":"65b6b425389af836a7
    // e3c661","createdAt":"2024-01-28T20:08:05.919Z","updatedAt":"2024-01-28T20:08:05.919Z","__v":0},"EVENT_TYPE":"USER_CREATED_BY_PHONE"}
    const snsMessage = Object.assign({ user }, { EVENT_TYPE });
    return this._publishToAuthTopicARN(JSON.stringify(snsMessage));
  }
}
