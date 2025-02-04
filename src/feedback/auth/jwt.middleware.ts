import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
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

    try {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    console.log('Middleware passed');
    next();
  }
}
