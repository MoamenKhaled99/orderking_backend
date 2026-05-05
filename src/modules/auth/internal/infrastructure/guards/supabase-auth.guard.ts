import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { createPublicKey } from 'crypto';
import axios from 'axios';
import type { Request } from 'express';
import { UnauthorizedError } from '../../../../../shared/application/errors/unauthorized.error';

interface JWK {
  kty: string;
  kid: string;
  [key: string]: unknown;
}

let jwksCache: JWK[] | null = null;
let jwksCachedAt = 0;
const JWKS_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function fetchJWKS(supabaseUrl: string): Promise<JWK[]> {
  const now = Date.now();
  if (jwksCache && now - jwksCachedAt < JWKS_TTL_MS) return jwksCache;
  const url = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;
  const { data } = await axios.get<{ keys: JWK[] }>(url, { timeout: 5000 });
  jwksCache = data.keys;
  jwksCachedAt = now;
  return jwksCache;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');

    if (!supabaseUrl) {
      throw new UnauthorizedError('Supabase URL is not configured');
    }

    // Decode header to get kid (key ID)
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string') {
      throw new UnauthorizedError('Token is malformed');
    }

    try {
      const keys = await fetchJWKS(supabaseUrl);
      const kid = decoded.header.kid as string | undefined;
      const jwk = kid ? keys.find((k) => k.kid === kid) : keys[0];

      if (!jwk) {
        throw new UnauthorizedError('No matching signing key found');
      }

      const publicKey = createPublicKey({ key: jwk as any, format: 'jwk' });
      const payload = jwt.verify(token, publicKey, {
        algorithms: ['ES256', 'RS256'],
      }) as jwt.JwtPayload;

      (request as any).user = {
        userId: payload['sub'],
        email: payload['email'] ?? '',
      };
      return true;
    } catch (err: any) {
      if (err instanceof UnauthorizedError) throw err;
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Token has expired');
      }
      throw new UnauthorizedError(`JWT error: ${err.message}`);
    }
  }
}
