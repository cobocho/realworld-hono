import { container } from 'tsyringe';

import redis from '@shared/cache/redis-client'; // redis 클라이언트 import
import { RedisService } from '@shared/cache/redis-service';

import { FollowRepository } from './repositories/follow-repository';
import { UsersRepository } from './repositories/users-repository';
import { AuthService } from './services/auth-service';
import { EditUserUseCase } from './use-cases/edit-user-use-case';
import { GetProfileUseCase } from './use-cases/get-profile-use-case';
import { GetUserUseCase } from './use-cases/get-user-use-case';
import { UserLoginUseCase } from './use-cases/user-login-use-case';
import { UserRegistrationUseCase } from './use-cases/user-registration-use-case';

container.register('RedisClient', {
  useValue: redis,
});

container.register(UsersRepository, { useClass: UsersRepository });
container.register(FollowRepository, { useClass: FollowRepository });

container.register(EditUserUseCase, { useClass: EditUserUseCase });
container.register(UserRegistrationUseCase, {
  useClass: UserRegistrationUseCase,
});
container.register(UserLoginUseCase, { useClass: UserLoginUseCase });
container.register(GetUserUseCase, { useClass: GetUserUseCase });
container.register(GetProfileUseCase, { useClass: GetProfileUseCase });

container.register(AuthService, { useClass: AuthService });
container.register(RedisService, { useClass: RedisService });

export { container };
