import { container } from 'tsyringe';

import { createHono } from '@shared/utils/open-api';
import { HttpStatusCode } from '@shared/utils/response';

import { userRegisterRoute } from './docs/openapi';
import { UserRegistrationUseCase } from './use-cases/user-registration';

import './users.di';

const userApp = createHono();

userApp.openapi(userRegisterRoute, async c => {
  const user = c.req.valid('json');

  const userRegistrationUseCase = container.resolve(UserRegistrationUseCase);
  const { username, email, bio, image } =
    await userRegistrationUseCase.execute(user);

  return c.json(
    {
      message: 'User created successfully',
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

export default userApp;
