import { container } from 'tsyringe';

import redis from '@shared/cache/redis-client'; // redis 클라이언트 import
import { RedisService } from '@shared/cache/redis-service';

import { AuthService } from './services/auth-service';
import { UserLoginUseCase } from './use-cases/user-login-use-case';
import { UserRegistrationUseCase } from './use-cases/user-registration-use-case';
import { UsersRepository } from './repositories/users-repository';

container.register('RedisClient', {
  useValue: redis,
});

container.register(UsersRepository, { useClass: UsersRepository });

container.register(UserRegistrationUseCase, {
  useClass: UserRegistrationUseCase,
});
container.register(UserLoginUseCase, { useClass: UserLoginUseCase });

container.register(AuthService, { useClass: AuthService });
container.register(RedisService, { useClass: RedisService });

export { container };
