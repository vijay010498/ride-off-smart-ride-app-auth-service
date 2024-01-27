import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtpDocument } from './otp.schema';
import { AwsService } from '../aws/aws.service';
import { randomBytes } from 'crypto';
import { VerifyOptDto } from './dtos/verify-opt.dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  constructor(
    @InjectModel('Otp') private readonly otpCollection: Model<OtpDocument>,
    private readonly awsService: AwsService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
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

  // TODO look into deleteOTP method do we need to return true ?
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
      this.logger.error('sendOtpError', err);
      if (err instanceof UnprocessableEntityException) {
        throw err;
      } else {
        // other than defined errors in try block
        // If anything goes wrong delete OTP if it was saved
        await this._deleteOTP(phoneNumber);
        throw new InternalServerErrorException(
          'Failed to send OTP, please try again later',
        );
      }
    }
  }

  async verifyOtp(attrs: VerifyOptDto) {
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

      // delete OTP & check user status
      // Disable eslint for unused variable _
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,prefer-const
      let [_, user] = await Promise.all([
        this._deleteOTP(attrs.phoneNumber),
        this.userService.getUserByPhone(attrs.phoneNumber),
      ]);

      let isSignedUp = false;
      if (user && user.signedUp) {
        isSignedUp = true;
      } else if (!user) {
        user = await this.userService.createUserByPhone(attrs.phoneNumber);
      }

      // OTP - matches - Generate auth tokens
      const { accessToken, refreshToken } = await this.tokenService.getTokens(
        user.id,
        user.phoneNumber,
      );

      // update refresh token into user collection
      await this.tokenService.updateRefreshToken(user.id, refreshToken);

      return {
        message: 'OTP Verified Successfully',
        isSignedUp,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error('verifyOtpError', error);
      if (
        error instanceof UnprocessableEntityException ||
        error instanceof BadRequestException
      ) {
        throw error; // Rethrow known exceptions
      } else {
        throw new InternalServerErrorException(
          'Failed to Verify OTP, please try again later',
        );
      }
    }
  }

  async resendOtp(phoneNumber: string) {
    // TODO implement logic to check lastSent time to re-send only after 2 minutes of last sent time in future
    try {
      // NOTE - Enters Critical Code - Use Redis Locks in future
      // Check if OTP exists
      const [{ otpExists: existingOTP, otpObject }] = await Promise.all([
        this._OTPExists(phoneNumber),
      ]);

      // No OTP generated
      if (!existingOTP) {
        throw new UnprocessableEntityException('Otp Not generated');
      }

      // Resend the existing OTP
      await this.awsService.sendOtpToPhone(phoneNumber, otpObject.otp);

      return { success: true, message: 'OTP re-sent successfully' };
    } catch (resendOtpError) {
      this.logger.error('resendOtpError', resendOtpError);
      if (resendOtpError instanceof UnprocessableEntityException)
        throw resendOtpError;
      else {
        throw new InternalServerErrorException(
          'Failed to re-send OTP, please try again later',
        );
      }
    }
  }
}
