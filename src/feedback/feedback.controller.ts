import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from './schemas/feedback.shema';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  private validateToken(authorizationHeader: string): void {
    const token = authorizationHeader?.split(' ')[1]; // Extract the token
    const expectedToken = crypto
      .createHash('sha256')
      .update('authorized-user')
      .digest('hex');

    if (token !== expectedToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  // Fetch all feedback
  @Get()
  async getAllFeedback(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  // Add new feedback
  @Post()
  async createFeedback(
    @Body() feedback: Feedback,
    @Req() req: any,
  ): Promise<Feedback> {
    this.validateToken(req.headers.authorization); // Validate token
    return this.feedbackService.create(feedback);
  }

  // Update existing feedback by ID
  @Put(':id')
  async updateFeedback(
    @Param('id') id: string,
    @Body() feedback: Feedback,
    @Req() req: any,
  ): Promise<Feedback> {
    this.validateToken(req.headers.authorization); // Validate token
    return this.feedbackService.update(id, feedback);
  }

  // Delete feedback by ID
  @Delete(':id')
  async deleteFeedback(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Feedback> {
    this.validateToken(req.headers.authorization); // Validate token
    return this.feedbackService.delete(id);
  }

  // Verify password for restricted operations
  @Post('verify-password')
  verifyPassword(@Body('password') password: string): { token: string } {
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (hashedPassword !== process.env.AUTH_PASSWORD_HASH) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = jwt.sign({ role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return { token };
  }
}
