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
import * as dotenv from 'dotenv';

dotenv.config();

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  private validateToken(authorizationHeader?: string) {
    // Typical "Bearer <token>" format
    if (!authorizationHeader) {
      throw new HttpException(
        'Missing Authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new HttpException(
        'Malformed Authorization header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      // Will throw if invalid or expired
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // Fetch all feedback
  @Get()
  async getAllFeedback(@Req() req: Request /* fetch API's Request */) {
    const authHeader = req.headers['authorization'];
    this.validateToken(authHeader);
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
  async deleteFeedback(@Param('id') id: string, @Req() req: any): Promise<any> {
    console.log('🗑 Deleting feedback with ID:', id);

    try {
      const deletedFeedback = await this.feedbackService.delete(id);

      if (!deletedFeedback) {
        console.error('❌ Feedback not found in database:', id);
        throw new HttpException('Feedback not found', HttpStatus.NOT_FOUND);
      }

      console.log('✅ Successfully deleted:', deletedFeedback);
      return { message: 'Feedback deleted successfully' };
    } catch (error) {
      console.error('❌ Error in deleteFeedback:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Verify password for restricted operations
  @Post('verify-password')
  verifyPassword(@Body('password') password: string): { token: string } {
    console.log('ENV HASH =>', process.env.AUTH_PASSWORD_HASH);
    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (hashedPassword !== process.env.AUTH_PASSWORD_HASH) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    // If the password matches the hash, generate a JWT:
    const token = jwt.sign({ role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { token };
  }
}
