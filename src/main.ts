import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options: CorsOptions = {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.enableCors(options);

  await app.listen(3000);
}
bootstrap();
