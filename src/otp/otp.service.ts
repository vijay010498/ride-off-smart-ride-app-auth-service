import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtpDocument } from './otp.schema';
import { AwsService } from '../aws/aws.service';
import { randomBytes } from 'crypto';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel('Otp') private readonly otpCollection: Model<OtpDocument>,
    private readonly awsService: AwsService,
  ) {}

  private _generateOTP(length: number = 6): string {
    const characters = '0123456789';
    const charactersLength = characters.length;

    let otp = '';
    const randomBytesBuffer = randomBytes(length);

    for (let i = 0; i < length; i++) {
      const randomIndex = randomBytesBuffer.readUInt8(i) % charactersLength;
      otp += characters.charAt(randomIndex);
    }

    return otp;
  }

  private async _OTPExists(phoneNumber: string) {
    const optExists = await this.otpCollection.findOne({ phoneNumber });
    if (optExists) return true;
    return false;
  }

  async sendOTP(phoneNumber: string) {
    // existing OTP
    const [existingOTP] = await Promise.all([this._OTPExists(phoneNumber)]);

    // OTP is not expired
    if (existingOTP) {
      throw new UnprocessableEntityException(
        'OTP already generated / not expired, please resend OTP',
      );
    }

    const OTP = this._generateOTP();

    const otp = new this.otpCollection({ phoneNumber, otp: OTP });

    // store OTP in Collection under phoneNumber and send SMS

    try {
      await Promise.all([
        otp.save(),
        this.awsService.sendOtpToPhone(phoneNumber, OTP),
      ]);
    } catch (OTPStoreAndSendError) {
      console.error('OTPStoreAndSendError', OTPStoreAndSendError);
      throw new InternalServerErrorException('Otp Not Sent, try again later');
    }
    return 'Otp Sent Successfully';
  }
}
