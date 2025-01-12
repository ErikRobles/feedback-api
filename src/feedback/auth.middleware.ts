import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']; // Expecting the password in the Authorization header

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    // Hash the incoming password using SHA-256
    const hashedPassword = crypto
      .createHash('sha256')
      .update(authHeader)
      .digest('hex');

    // Compare the hashed password to the stored hash
    if (hashedPassword !== process.env.AUTH_PASSWORD_HASH) {
      throw new UnauthorizedException('Invalid password');
    }

    next();
  }
}
