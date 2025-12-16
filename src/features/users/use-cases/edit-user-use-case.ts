import { injectable } from 'tsyringe';

import type { EditUserDto } from '../model/edit-user-dto';
import { UsersRepository } from '../repositories/users-repository';

@injectable()
export class EditUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string, { user }: EditUserDto) {
    const { hash_password: _, ...updatedUser } =
      await this.usersRepository.updateUser(userId, { user });

    return updatedUser;
  }
}
