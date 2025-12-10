import { Hono } from 'hono';
import { container } from 'tsyringe';

import { HttpStatusCode, Response } from '@shared/utils/response';
import { zv } from '@shared/utils/zod';

import { UserRegistrationUseCase } from './use-cases/user-registration';
import { userRegisterSchema } from './validation/user-register.dto';

import './users.di';

const userApp = new Hono();

userApp.get('/', async c => {
  return c.text('Users API is running');
});

userApp.post('/', zv('json', userRegisterSchema), async c => {
  const user = c.req.valid('json');

  const userRegistrationUseCase = container.resolve(UserRegistrationUseCase);
  const newUser = await userRegistrationUseCase.execute(user);

  return Response.success(c, {
    message: 'User created successfully',
    data: newUser,
    status: HttpStatusCode.created,
  });
});

export default userApp;
