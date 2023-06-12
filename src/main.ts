import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options: CorsOptions = {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  };

  app.use(cookieParser());
  app.enableCors(options);

  await app.listen(3000);
}
bootstrap();
