// user-login.usecase.ts
import { injectable } from 'tsyringe';

import { AuthenticationError } from '@shared/error/errors';

import type { UserLoginDto } from '../model/user-login.dto';
import { SessionCache } from '../repositories/session-cache';
import { UsersRepository } from '../repositories/users-repository';
import { AuthService } from '../services/auth-service';

@injectable()
export class UserLoginUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly sessionCache: SessionCache
  ) {}

  async execute({ user }: UserLoginDto) {
    const existingUser = await this.usersRepository.findByEmail(user.email);

    if (!existingUser) {
      throw new AuthenticationError('Invalid password or email');
    }

    const isPasswordValid = await this.authService.comparePassword(
      user.password,
      existingUser.hash_password
    );

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid password or email');
    }

    const { token, sessionID, expiresIn } =
      await this.authService.generateToken(existingUser.user_id);

    await this.sessionCache.saveSession(
      existingUser.user_id,
      sessionID,
      expiresIn
    );

    return {
      email: existingUser.email,
      username: existingUser.username,
      bio: existingUser.bio,
      image: existingUser.image,
      token,
    };
  }
}
