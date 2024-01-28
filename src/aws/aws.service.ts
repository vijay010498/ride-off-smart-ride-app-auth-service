import { Injectable, Logger } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);
  private readonly SNS = new SNSClient({
    apiVersion: 'latest',
    region: 'ca-central-1',
    credentials: {
      accessKeyId: process.env.aws_sns_access_key_id,
      secretAccessKey: process.env.aws_sns_secret_access_key,
    },
  });

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
      const response = await this.SNS.send(new PublishCommand(smsParams));
      this.logger.log('Otp Sent Successfully', response);
    } catch (sendOtpToPhoneError) {
      this.logger.error('sendOtpToPhoneError', sendOtpToPhoneError);
      throw sendOtpToPhoneError;
    }
  }
}
