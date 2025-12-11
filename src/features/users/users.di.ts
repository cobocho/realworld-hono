import { container } from 'tsyringe';

import { AuthService } from './services/auth-service';
import { UserRegistrationUseCase } from './use-cases/user-registration';
import { UsersRepository } from './users.repository';

container.register(UsersRepository, { useClass: UsersRepository });
container.register(UserRegistrationUseCase, {
  useClass: UserRegistrationUseCase,
});
container.register(AuthService, { useClass: AuthService });

export { container };
