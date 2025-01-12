import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { Feedback, FeedbackSchema } from './schemas/feedback.shema';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Feedback.name, schema: FeedbackSchema },
    ]),
  ],
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'feedback', method: RequestMethod.GET })
      .forRoutes('feedback');
  }
}
