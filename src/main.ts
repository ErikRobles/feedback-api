import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173', // For local development
      'https://blissful-turing-be15a5.netlify.app/', // Your Netlify domain
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Auth-Password'],
    credentials: true, // Allow credentials like cookies or Authorization headers
  });

  await app.listen(5000);
}
bootstrap();
