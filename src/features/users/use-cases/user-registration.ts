import { inject, injectable } from 'tsyringe';

import type { User } from '@core/db/schema';

import { ConflictError } from '@shared/error/errors';

import { AuthService } from '../services/auth-service';
import { UsersRepository } from '../users.repository';
import type { UserRegisterDto } from '../validation/user-register.dto';

@injectable()
export class UserRegistrationUseCase {
  constructor(
    @inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @inject(AuthService)
    private readonly authService: AuthService
  ) {}

  async execute({ user }: UserRegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictError(`User with email ${user.email} already exists`);
    }

    const hashedPassword = await this.authService.hashPassword(user.password);

    return this.usersRepository.createUser({
      user: { ...user, password: hashedPassword },
    });
  }
}
