import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { Feedback, FeedbackSchema } from './schemas/feedback.shema';
import { JwtMiddleware } from './auth/jwt.middleware';

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
    // consumer
    //   .apply(JwtMiddleware)
    //   .exclude(
    //     { path: 'feedback', method: RequestMethod.GET },
    //     { path: 'feedback/verify-password', method: RequestMethod.POST },
    //   )
    //   .forRoutes('feedback');
  }
}
