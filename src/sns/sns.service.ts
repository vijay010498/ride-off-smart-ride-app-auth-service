import { Injectable, Logger } from '@nestjs/common';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { MyConfigService } from '../my-config/my-config.service';
import { UserDocument } from '../user/user.schema';
import { Events } from '../common/enums/events.enums';

@Injectable()
export class SnsService {
  private readonly logger = new Logger(SnsService.name);
  private readonly SNS: SNSClient;

  constructor(private readonly configService: MyConfigService) {
    this.SNS = new SNSClient({
      apiVersion: 'latest',
      region: this.configService.getAwsRegion(),
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
    EVENT_TYPE: string = Events.userCreatedByPhone,
  ) {
    // {"user":{"phoneNumber":"437-556-4035","signedUp":false,"isBlocked":false,"faceIdVerified":false,"_id":"65b6b425389af836a7
    // e3c661","createdAt":"2024-01-28T20:08:05.919Z","updatedAt":"2024-01-28T20:08:05.919Z","__v":0},"EVENT_TYPE":"USER_CREATED_BY_PHONE"}
    const snsMessage = Object.assign({ user }, { EVENT_TYPE, userId: user.id });
    return this._publishToAuthTopicARN(JSON.stringify(snsMessage));
  }

  async userUpdatedEvent(
    updatedUser: UserDocument,
    EVENT_TYPE: string = Events.userUpdated,
  ) {
    const snsMessage = Object.assign(
      { updatedUser },
      { EVENT_TYPE, userId: updatedUser.id },
    );
    // {"updatedUser":{"lastLocation":{"type":"Point","coordinates":[-80.5579867,43.4347027]},"_id":"65b84dffb9fe51e7778da
    // e01","phoneNumber":"437-556-4035","signedUp":true,"isBlocked":false,"faceIdVerified":false,"createdAt":"2024-01-30T01:16:47.309Z","updatedAt":"2024-01-30T02:54:36.7
    // 98Z","__v":0,"refreshToken":"$argon2id$v=19$m=65536,t=3,p=4$L9kCI9oGymc92QJ6E31ZSQ$LrgPnRhnzilT9GNdWJAxyLIp2pvR7SJNtxTz18jsRNE","email":"derryckdxd@gmail.com","firs
    // tName":"Derryck","lastName":"Dowuona"},"EVENT_TYPE":"USER_UPDATED","userId":"65b84dffb9fe51e7778dae01"}
    return this._publishToAuthTopicARN(JSON.stringify(snsMessage));
  }

  async tokenBlackListEvent(
    token: string,
    EVENT_TYPE: string = Events.tokenBlackList,
  ) {
    return this._publishToAuthTopicARN(JSON.stringify({ token, EVENT_TYPE }));
  }
}
