import { injectable } from 'tsyringe';

import { UsersRepository } from '../repositories/users-repository';

@injectable()
export class GetUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string) {
    return this.usersRepository.findByUserId(userId);
  }
}
