import { createRoute, z } from '@hono/zod-openapi';

import { jwtMiddleware } from '@features/users/middlewares/jwt-middleware';

import { HttpStatusCode } from '@shared/utils/response';

import { editUserResponseSchema, editUserSchema } from '../model/edit-user-dto';
import {
  getProfileResponseSchema,
  getProfileSchema,
} from '../model/get-profile';
import { getUserResponseSchema } from '../model/get-user.dto';
import {
  userLoginResponseSchema,
  userLoginSchema,
} from '../model/user-login.dto';
import {
  userRegisterResponseSchema,
  userRegisterSchema,
} from '../model/user-register.dto';

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
  },
});

export const editUserRoute = createRoute({
  method: 'put',
  path: '/',
  tags: ['users'],
  summary: 'Edit a user',
  description: 'Edit a user',
  middleware: [jwtMiddleware],
  request: {
    body: {
      content: {
        'application/json': {
          schema: editUserSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCode.success]: {
      description: 'User edited',
      content: {
        'application/json': {
          schema: z.object({
            user: editUserResponseSchema,
            message: z
              .string()
              .openapi({ example: 'User edited successfully' }),
            status: z.literal(HttpStatusCode.success),
          }),
        },
      },
    },
  },
});

export const getProfileRoute = createRoute({
  method: 'get',
  path: '/{userId}',
  tags: ['users'],
  summary: 'Get a profile',
  description: 'Get a profile',
  request: {
    params: getProfileSchema,
  },
  responses: {
    [HttpStatusCode.success]: {
      description: 'Profile retrieved',
      content: {
        'application/json': {
          schema: z.object({
            profile: getProfileResponseSchema,
            message: z
              .string()
              .openapi({ example: 'Profile retrieved successfully' }),
            status: z.literal(HttpStatusCode.success),
          }),
        },
      },
    },
  },
});
