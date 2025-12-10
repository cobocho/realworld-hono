import { Context } from 'hono';

import {
  HttpStatusCode,
  HttpStatusCodeType,
  Response,
} from '../utils/response';

import { AppError } from './errors';

export const errorHandler = (err: Error, c: Context) => {
  if (err instanceof AppError) {
    return Response.error(c, {
      message: err.message,
      status: err.status as HttpStatusCodeType,
    });
  }

  return Response.error(c, {
    message: 'Internal server error, ' + err.message,
    status: HttpStatusCode.internalServerError,
  });
};
