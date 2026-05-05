import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import type { Request } from 'express';
import { UnauthorizedError } from '../../../../../shared/application/errors/unauthorized.error';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const secret = this.configService.get<string>('SUPABASE_JWT_SECRET');

    if (!secret) {
      throw new UnauthorizedError('JWT secret is not configured');
    }

    try {
      const payload = jwt.verify(token, secret) as jwt.JwtPayload;
      (request as any).user = {
        userId: payload['sub'],
        email: payload['email'] ?? '',
      };
      return true;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token has expired');
      }
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedError('Token is malformed');
      }
      throw new UnauthorizedError('Invalid token');
    }
  }
}
