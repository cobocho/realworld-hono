import { createMiddleware } from 'hono/factory';
import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';

import { AuthenticationError } from '@shared/error/errors';
import { isJwtPayload, type JwtPayload } from '@shared/types/jwt';

import { SessionCache } from '../repositories/session-cache';

export const jwtMiddleware = createMiddleware(async (c, next) => {
  try {
    const tokenHeader = c.req.header('Authorization');

    const token = tokenHeader?.split(' ')[1];

    if (!token) {
      throw new AuthenticationError('Unauthorized');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const decoded = isJwtPayload(payload);

    if (!decoded) {
      throw new AuthenticationError('Invalid token');
    }

    const sessionCache = container.resolve(SessionCache);

    const hasSession = await sessionCache.hasSession(
      payload.userId,
      payload.sessionID
    );

    if (!hasSession) {
      throw new AuthenticationError('Invalid token');
    }

    c.set('payload', payload);

    await next();
  } catch (error) {
    throw new AuthenticationError(
      error instanceof Error ? error.message : 'Unauthorized'
    );
  }
});
