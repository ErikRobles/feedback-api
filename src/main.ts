import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173', // For local development
      'https://6784418a064c6d0008452513--blissful-turing-be15a5.netlify.app', // For production
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Apply AuthMiddleware only to feedback routes (excluding /verify-password)

  await app.listen(5000); // Ensure your backend is listening on port 5000
}
bootstrap();
