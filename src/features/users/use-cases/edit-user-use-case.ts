import { injectable } from 'tsyringe';

import { UsersRepository } from '../repositories/users-repository';
import type { EditUserDto } from '../model/edit-user-dto';

@injectable()
export class EditUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(userId: string, { user }: EditUserDto) {
    const { hash_password: _, ...updatedUser } =
      await this.usersRepository.updateUser(userId, { user });
    return updatedUser;
  }
}
