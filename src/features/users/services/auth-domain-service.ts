import { sign } from 'hono/jwt';
import type { JWTPayload } from 'hono/utils/jwt/types';
import ms from 'ms';
import { injectable } from 'tsyringe';

import type { JwtPayload } from '@shared/types/jwt';

@injectable()
export class AuthDomainService {
  private readonly saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return Bun.password.hash(password, {
      algorithm: 'bcrypt',
      cost: this.saltRounds,
    });
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return Bun.password.verify(password, hashedPassword);
  }

  async generateToken(userId: string) {
    const expiresInString = process.env.JWT_EXPIRES_IN as ms.StringValue;

    const expiresIn = ms(expiresInString);
    const sessionID = Bun.randomUUIDv7();

    const payload: JwtPayload = {
      sessionID,
      userId,
      exp: Math.floor((Date.now() + expiresIn) / 1000),
      iat: Math.floor(Date.now() / 1000),
    };

    const token = await sign(
      payload as unknown as JWTPayload,
      process.env.JWT_SECRET!,
      'HS256'
    );

    return {
      token,
      expiresIn,
      sessionID,
    };
  }
}
