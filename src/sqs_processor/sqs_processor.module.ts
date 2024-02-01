import { Module } from '@nestjs/common';
import { SqsProcessorService } from './sqs_processor.service';

@Module({
  providers: [SqsProcessorService],
  exports: [SqsProcessorService],
})
export class SqsProcessorModule {}
