import { inject, injectable } from 'tsyringe';

import type { User } from '@core/db/schema';

import { ConflictError } from '@shared/error/errors';

import type { UserRegisterDto } from '../model/user-register.dto';
import { UsersRepository } from '../repositories/users-repository';
import { AuthDomainService } from '../services/auth-domain-service';

@injectable()
export class UserRegistrationUseCase {
  constructor(
    @inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @inject(AuthDomainService)
    private readonly AuthDomainService: AuthDomainService
  ) {}

  async execute({ user }: UserRegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictError(`User with email ${user.email} already exists`);
    }

    const hashedPassword = await this.AuthDomainService.hashPassword(
      user.password
    );

    return this.usersRepository.createUser({
      user: { ...user, password: hashedPassword },
    });
  }
}
