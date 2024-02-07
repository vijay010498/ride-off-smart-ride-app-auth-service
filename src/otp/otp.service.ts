import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
  Logger,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OtpDocument } from './otp.schema';
import { randomBytes } from 'crypto';
import { VerifyOptDto } from './dtos/verify-opt.dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { SnsService } from '../sns/sns.service';
import { GenerateOtpResponseDto } from './dtos/generate-otp-response.dto';
import { VerifyOtpResponseDto } from './dtos/verify-otp-response.dto';
import { ResendOtpResponseDto } from './dtos/resend-otp-response.dto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @InjectModel('Otp') private readonly otpCollection: Model<OtpDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly snsService: SnsService,
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

  private _getCacheKey(phoneNumber: string) {
    return `OTP_CACHE#${phoneNumber}`;
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
        this.snsService.sendOtpToPhone(phoneNumber, OTP),
      ]);

      // save into cache with 2 minutes TTL
      // Users can request for resent OTP after 2 minutes of last sent time
      // Note: OTP expires in 5 minutes
      await this.cacheManager.set(this._getCacheKey(phoneNumber), true, 120000);

      return new GenerateOtpResponseDto({
        success: true,
        message: 'OTP sent successfully',
        resendTime: '2 Minutes', // TODO update into Milliseconds
      });
    } catch (err) {
      this.logger.error('sendOtpError', err);
      if (err instanceof UnprocessableEntityException) {
        throw err;
      } else {
        // other than defined errors in try block
        // If anything goes wrong delete OTP if it was saved // also remove from cache
        await this._deleteOTP(phoneNumber);
        await this.cacheManager.del(this._getCacheKey(phoneNumber));
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
      if (otpObject.otp !== attrs.userOtp) {
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

      return new VerifyOtpResponseDto({
        message: 'OTP Verified Successfully',
        isSignedUp,
        accessToken,
        refreshToken,
      });
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
    try {
      // NOTE - Enters Critical Code - Use Redis Locks in future

      // check if OTP sent in last 2 minutes in cache
      const otpSentInCache = await this.cacheManager.get(
        this._getCacheKey(phoneNumber),
      );

      if (otpSentInCache) {
        throw new UnprocessableEntityException(
          'Otp Sent within last 2 minutes',
        );
      }

      // Check if OTP exists
      const [{ otpExists: existingOTP, otpObject }] = await Promise.all([
        this._OTPExists(phoneNumber),
      ]);

      // No OTP generated
      if (!existingOTP) {
        throw new UnprocessableEntityException('Otp Not generated');
      }

      // Resend the existing OTP
      await this.snsService.sendOtpToPhone(phoneNumber, otpObject.otp);

      return new ResendOtpResponseDto({
        success: true,
        message: 'OTP re-sent successfully',
      });
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
