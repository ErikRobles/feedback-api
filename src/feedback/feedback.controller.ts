import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from './schemas/feedback.shema';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // Fetch all feedback
  @Get()
  async getAllFeedback(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  // Add new feedback
  @Post()
  async createFeedback(@Body() feedback: Feedback): Promise<Feedback> {
    return this.feedbackService.create(feedback);
  }

  // Update existing feedback by ID
  @Put(':id')
  async updateFeedback(
    @Param('id') id: string,
    @Body() feedback: Feedback,
  ): Promise<Feedback> {
    return this.feedbackService.update(id, feedback);
  }

  // Delete feedback by ID
  @Delete(':id')
  async deleteFeedback(@Param('id') id: string): Promise<Feedback> {
    return this.feedbackService.delete(id);
  }

  // Verify password for restricted operations
  @Post('verify-password')
  verifyPassword(@Body('password') password: string): void {
    const hashedPassword = process.env.AUTH_PASSWORD_HASH;
    const crypto = require('crypto');
    const hashedInput = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (hashedInput !== hashedPassword) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
  }
}
