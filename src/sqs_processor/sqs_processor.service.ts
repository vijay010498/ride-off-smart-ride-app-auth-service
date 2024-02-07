import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';
import { UserService } from '../user/user.service';
import { Events } from '../common/enums/events.enums';
import mongoose from 'mongoose';

@Injectable()
export class SqsProcessorService {
  private readonly logger = new Logger(SqsProcessorService.name);

  constructor(private readonly userService: UserService) {}

  async ProcessSqsMessage(messages: Message[]) {
    try {
      await Promise.all(
        messages.map(({ Body }) => {
          try {
            const parsedBody = JSON.parse(Body);
            if (parsedBody.Message) {
              // Message sent from SNS
              const parsedMessage = JSON.parse(parsedBody.Message);
              if (parsedMessage['EVENT_TYPE']) {
                const { EVENT_TYPE, userId, verificationId } = parsedMessage;
                this.logger.log(
                  'Sqs Message',
                  EVENT_TYPE,
                  userId,
                  verificationId,
                );
                switch (EVENT_TYPE) {
                  case Events.userFaceVerified:
                    return this._handleUserFaceVerified(userId, verificationId);
                  default:
                    this.logger.warn(`Unhandled event type: ${EVENT_TYPE}`);
                    break;
                }
              }
            }
          } catch (error) {
            this.logger.error('Error Parsing SQS message:', error);
            throw error;
          }
        }),
      );
    } catch (error) {
      this.logger.error('Error processing SQS messages:', error);
      throw error;
    }
  }

  private async _handleUserFaceVerified(
    userId: string,
    verificationId: mongoose.Types.ObjectId,
  ) {
    try {
      await this.userService.userFaceVerified(userId, verificationId);
    } catch (error) {
      this.logger.error('_handleUserFaceVerified-sqs-processor-error', error);
      throw error;
    }
  }
}
