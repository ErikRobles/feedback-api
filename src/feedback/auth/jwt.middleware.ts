import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']; // Expecting the token in the Authorization header

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1]; // Extract the token
    const expectedToken = crypto
      .createHash('sha256')
      .update('authorized-user') // Replace this with your secure token logic
      .digest('hex');

    if (token !== expectedToken) {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }
}
