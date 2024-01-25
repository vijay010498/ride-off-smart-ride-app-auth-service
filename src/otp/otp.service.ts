import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtpDocument } from './otp.schema';
import { AwsService } from '../aws/aws.service';
import { randomBytes } from 'crypto';
import { VerifyOptDto } from './dtos/verify-opt.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel('Otp') private readonly otpCollection: Model<OtpDocument>,
    private readonly awsService: AwsService,
    private readonly userService: UserService,
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
    return {
      otpObject: optExists,
      otpExists: optExists ? true : false,
    };
  }

  private async _deleteOTP(phoneNumber: string) {
    await this.otpCollection.findOneAndDelete({
      phoneNumber,
    });
    return true;
  }

  async sendOTP(phoneNumber: string) {
    try {
      // NOTE - Enters Critical Code - Use Redis Locks in future
      // Check if OTP exists
      const [{ otpExists: existingOTP }] = await Promise.all([
        this._OTPExists(phoneNumber),
      ]);

      // OTP is not expired
      if (existingOTP) {
        throw new UnprocessableEntityException(
          'OTP already generated / not expired, please resend OTP',
        );
      }

      // Generate OTP
      const OTP = this._generateOTP();

      // Save OTP to database and send via SMS
      const otpDocument = new this.otpCollection({ phoneNumber, otp: OTP });
      await Promise.all([
        otpDocument.save(),
        this.awsService.sendOtpToPhone(phoneNumber, OTP),
      ]);

      return { success: true, message: 'OTP sent successfully' };
    } catch (err) {
      if (err instanceof UnprocessableEntityException) {
        throw err;
      } else {
        // Log or handle unexpected errors
        console.error(err);
        throw new InternalServerErrorException(
          'Failed to send OTP, please try again later',
        );
      }
    }
  }

  async verifyOtp(attrs: VerifyOptDto) {
    // TODO Complete this
    try {
      // NOTE - Enters Critical Code - Use Redis Locks in future
      // Check if OTP exists
      const [{ otpObject, otpExists: existingOTP }] = await Promise.all([
        this._OTPExists(attrs.phoneNumber),
      ]);

      // No OTP generated for given phoneNumber
      if (!existingOTP) {
        throw new UnprocessableEntityException('OTP Not Generated');
      }

      // OTP not-matches
      if (otpObject.otp !== attrs.userOtp.toString()) {
        throw new BadRequestException('Verification Failed/ Wrong OTP');
      }

      // OTP - matches TODO Generate auth tokens

      // delete OTP
      // TODO - add code to check for existence User from Users Service

      await Promise.all([
        this._deleteOTP(attrs.phoneNumber),
        this.userService.getUserByPhone(attrs.phoneNumber),
      ]);
    } catch (err) {
      if (err instanceof UnprocessableEntityException) {
        throw err;
      }
      if (err instanceof BadRequestException) {
        throw err;
      } else {
        console.error(err);
        throw new InternalServerErrorException(
          'Failed to Verify OTP, please try again later',
        );
      }
    }
  }
}
