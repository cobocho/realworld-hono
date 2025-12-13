import type { Context } from 'hono';

import { HttpStatusCode } from '../utils/response';

import { AppError, DatabaseError } from './errors';

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof DatabaseError) {
    console.error('database error', err.errors);

    return c.json(
      {
        message: err.message,
        status: err.status,
      },
      err.status
    );
  }

  if (err instanceof AppError) {
    return c.json(
      {
        message: err.message,
        errors: err.errors,
        status: err.status,
      },
      err.status
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
