import { container } from 'tsyringe';

import type { JwtPayload } from '@shared/types/jwt';
import { createHono } from '@shared/utils/open-api';
import { HttpStatusCode } from '@shared/utils/response';

import {
  editUserRoute,
  getProfileRoute,
  getUserRoute,
  userLoginRoute,
  userRegisterRoute,
} from './docs/openapi';
import { EditUserUseCase } from './use-cases/edit-user-use-case';
import { GetProfileUseCase } from './use-cases/get-profile-use-case';
import { GetUserUseCase } from './use-cases/get-user-use-case';
import { UserLoginUseCase } from './use-cases/user-login-use-case';
import { UserRegistrationUseCase } from './use-cases/user-registration-use-case';

import './users.di';

export const usersApp = createHono();

usersApp.openapi(userRegisterRoute, async c => {
  const user = c.req.valid('json');

  const userRegistrationUseCase = container.resolve(UserRegistrationUseCase);
  const createdUser = await userRegistrationUseCase.execute(user);

  return c.json(
    {
      message: 'User created successfully' as const,
      user: createdUser,
      status: HttpStatusCode.created,
    },
    HttpStatusCode.created
  );
});

usersApp.openapi(userLoginRoute, async c => {
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

export const userApp = createHono();

userApp.openapi(getUserRoute, async c => {
  const payload = c.get('payload') as JwtPayload;

  const getUserUseCase = container.resolve(GetUserUseCase);

  const user = await getUserUseCase.execute(payload.userId);

  return c.json({
    user,
    message: 'User retrieved successfully' as const,
    status: HttpStatusCode.success,
  });
});

userApp.openapi(editUserRoute, async c => {
  const payload = c.get('payload') as JwtPayload;

  const user = c.req.valid('json');

  const editUserUseCase = container.resolve(EditUserUseCase);
  const updatedUser = await editUserUseCase.execute(payload.userId, user);

  return c.json({
    user: updatedUser,
    message: 'User edited successfully' as const,
    status: HttpStatusCode.success,
  });
});

userApp.openapi(getProfileRoute, async c => {
  const userId = c.req.param('userId');
  const payload = c.get('payload') as JwtPayload | undefined;

  const getProfileUseCase = container.resolve(GetProfileUseCase);
  const profile = await getProfileUseCase.execute(userId, payload?.userId);

  return c.json({
    profile,
    message: 'Profile retrieved successfully' as const,
    status: HttpStatusCode.success,
  });
});
