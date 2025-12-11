import { createRoute, z } from '@hono/zod-openapi';

import { zodErrorSchema } from '@shared/hooks/after-zod-error';
import {
  HttpStatusCode,
  responseMessage,
  responseStatus,
} from '@shared/utils/response';

import {
  userRegisterResponseSchema,
  userRegisterSchema,
} from '../validation/user-register.dto';

export const userRegisterRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['users'],
  summary: 'Register a new user',
  description: 'Register a new user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: userRegisterSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: z.object({
            user: userRegisterResponseSchema,
            message: responseMessage('User created successfully'),
            status: responseStatus(HttpStatusCode.created),
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
    },
  },
});
