import { Context } from 'hono';

export const HttpStatusCode = {
  success: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500,
} as const;

export type HttpStatusCodeType =
  (typeof HttpStatusCode)[keyof typeof HttpStatusCode];

export interface ResponseInterface {
  status: HttpStatusCodeType;
  message?: string;
  data?: unknown;
}

export class Response {
  static success(c: Context, { message, data, status }: ResponseInterface) {
    return c.json(
      {
        success: true,
        message,
        data,
        status,
      },
      status
    );
  }

  static error(
    c: Context,
    {
      message,
      details,
      data,
      status,
    }: ResponseInterface & { details?: unknown }
  ) {
    return c.json(
      {
        success: false,
        message,
        details,
        data,
        status,
      },
      status
    );
  }
}
