import { createRoute, z } from '@hono/zod-openapi';

import { jwtMiddleware } from '@features/users/middlewares/jwt-middleware';

import { zodErrorSchema } from '@shared/hooks/after-zod-error';
import { HttpStatusCode } from '@shared/utils/response';

import { getUserResponseSchema } from '../validation/get-user.dto';
import {
  userLoginResponseSchema,
  userLoginSchema,
} from '../validation/user-login.dto';
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
    [HttpStatusCode.created]: {
      description: 'User created',
      content: {
        'application/json': {
          schema: z.object({
            user: userRegisterResponseSchema,
            message: z
              .string()
              .openapi({ example: 'User created successfully' }),
            status: z.literal(HttpStatusCode.created),
          }),
        },
      },
    },
    [HttpStatusCode.badRequest]: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
    },
    [HttpStatusCode.conflict]: {
      description: 'User already exists',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'User already exists' }),
          }),
        },
      },
    },
  },
});

export const userLoginRoute = createRoute({
  method: 'post',
  path: '/login',
  tags: ['users'],
  summary: 'Login a user',
  description: 'Login a user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: userLoginSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCode.success]: {
      description: 'User logged in',
      content: {
        'application/json': {
          schema: z.object({
            user: userLoginResponseSchema,
            message: z
              .string()
              .openapi({ example: 'User logged in successfully' }),
            status: z.literal(HttpStatusCode.success),
          }),
        },
      },
    },
    [HttpStatusCode.unauthorized]: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z
              .string()
              .openapi({ example: 'Invalid Password' })
              .or(
                z.string().openapi({
                  example: 'User with email john.doe@example.com not found',
                })
              ),
          }),
        },
      },
    },
    [HttpStatusCode.badRequest]: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: zodErrorSchema,
        },
      },
    },
  },
});

export const getUserRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['users'],
  summary: 'Get a user',
  description: 'Get a user',
  middleware: [jwtMiddleware],
  responses: {
    [HttpStatusCode.success]: {
      description: 'User retrieved',
      content: {
        'application/json': {
          schema: z.object({
            user: getUserResponseSchema,
            message: z
              .string()
              .openapi({ example: 'User retrieved successfully' }),
            status: z.literal(HttpStatusCode.success),
          }),
        },
      },
    },
    [HttpStatusCode.unauthorized]: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Unauthorized' }),
          }),
        },
      },
    },
  },
});
