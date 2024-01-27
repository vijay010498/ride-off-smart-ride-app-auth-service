import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
  });
  app.setGlobalPrefix('api/auth');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // If set to true validator will strip validated object of any properties that do not have any decorators Tip: if no other decorator is suitable for your property use @Allow decorator.
    }),
  );
  await app.listen(3000);
}
bootstrap().catch(() => {
  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
  process.exit(1);
});
