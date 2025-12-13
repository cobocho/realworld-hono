import { injectable } from 'tsyringe';

import { UsersRepository } from '../repositories/users-repository';

@injectable()
export class GetUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string) {
    const { hash_password: _, ...user } =
      await this.usersRepository.findByUserId(userId);

    return user;
  }
}
