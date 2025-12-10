import { inject, injectable } from 'tsyringe';

import { User } from '@core/db/schema';

import { ConflictError } from '@shared/error/errors';

import { UsersRepository } from '../users.repository';
import { UserRegisterDto } from '../validation/user-register.dto';

@injectable()
export class UserRegistrationUseCase {
  constructor(
    @inject(UsersRepository)
    private readonly usersRepository: UsersRepository
  ) {}

  async execute({ user }: UserRegisterDto): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictError(`User with email ${user.email} already exists`);
    }

    return this.usersRepository.createUser({ user });
  }
}
