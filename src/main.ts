import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow frontend communication
  app.enableCors();

  // Set the port to 5000
  await app.listen(5000);
}
bootstrap();
