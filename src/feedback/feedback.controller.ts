import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Controller('feedback')
export class FeedbackController {
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
