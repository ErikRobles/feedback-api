import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackModule } from './feedback/feedback.module';
import { JwtMiddleware } from './feedback/auth/jwt.middleware';
import { ConfigModule } from '@nestjs/config';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    FeedbackModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('feedback'); // Protect all feedback routes
  }
}
