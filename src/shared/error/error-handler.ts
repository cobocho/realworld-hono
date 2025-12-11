import type { Context } from 'hono';
import { ZodError } from 'zod';

import { HttpStatusCode } from '../utils/response';

import { AppError } from './errors';

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof ZodError) {
    console.log('zod error', err.issues);
  }

  if (err instanceof AppError) {
    return c.json(
      {
        message: err.message,
        errors: err.errors,
        status: HttpStatusCode.badRequest,
      },
      HttpStatusCode.badRequest
    );
  }

  return c.json(
    {
      message: 'Internal server error, ' + err.message,
      status: HttpStatusCode.internalServerError,
    },
    HttpStatusCode.internalServerError
  );
};
