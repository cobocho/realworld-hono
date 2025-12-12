import { container } from 'tsyringe';

import { createHono } from '@shared/utils/open-api';
import { HttpStatusCode } from '@shared/utils/response';

import { userLoginRoute, userRegisterRoute } from './docs/openapi';
import { UserLoginUseCase } from './use-cases/user-login-use-case';
import { UserRegistrationUseCase } from './use-cases/user-registration-use-case';

import './users.di';

const userApp = createHono();

userApp.openapi(userRegisterRoute, async c => {
  const user = c.req.valid('json');

  const userRegistrationUseCase = container.resolve(UserRegistrationUseCase);
  const { username, email, bio, image } =
    await userRegistrationUseCase.execute(user);

  return c.json(
    {
      message: 'User created successfully' as const,
      user: {
        email,
        username,
        bio,
        image,
      },
      status: HttpStatusCode.created,
    },
    HttpStatusCode.created
  );
});

userApp.openapi(userLoginRoute, async c => {
  const user = c.req.valid('json');

  const userLoginUseCase = container.resolve(UserLoginUseCase);
  const { email, username, bio, image, token } =
    await userLoginUseCase.execute(user);

  return c.json(
    {
      message: 'User logged in successfully' as const,
      user: {
        email,
        username,
        bio,
        image,
        token,
      },
      status: HttpStatusCode.success,
    },
    HttpStatusCode.success
  );
});

export default userApp;
