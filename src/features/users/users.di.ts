import { container } from 'tsyringe';

import { UserRegistrationUseCase } from './use-cases/user-registration';
import { UsersRepository } from './users.repository';

container.register(UsersRepository, { useClass: UsersRepository });
container.register(UserRegistrationUseCase, {
  useClass: UserRegistrationUseCase,
});

export { container };
