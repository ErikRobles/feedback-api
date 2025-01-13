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
    console.log(
      `Middleware triggered for path: ${req.path}, method: ${req.method}`,
    );
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      console.log('Missing Authorization header');
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const hashedToken = crypto
      .createHash('sha256')
      .update('authorized-user')
      .digest('hex');

    if (token !== hashedToken) {
      console.log('Invalid token:', token);
      throw new UnauthorizedException('Invalid token');
    }

    console.log('Middleware passed');
    next();
  }
}
