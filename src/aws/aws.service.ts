import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsService {
  sendOtpToPhone(phoneNumber: string, OTP: string) {
    // TODO - Implement SNS to send OTP as text message to the phone number
    console.log('AwsService-send otp request', phoneNumber, OTP);
    return Promise.resolve(true);
  }
}
