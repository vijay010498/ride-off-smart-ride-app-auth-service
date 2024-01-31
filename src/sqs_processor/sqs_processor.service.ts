import { Injectable, Logger, NotImplementedException } from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsProcessorService {
  private readonly logger = new Logger(SqsProcessorService.name);

  async ProcessSqsMessage(messages: Message[]) {
    // TODO Implement Process Message
    this.logger.log('ProcessSqsMessage', messages);
    throw new NotImplementedException('Implement Process Messages');
  }
}
