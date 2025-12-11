import z from 'zod';

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

export interface ResponseInterface<T = unknown> {
  status: HttpStatusCodeType;
  message?: string;
  data?: T;
}

export const responseMessage = <T extends string>(message: T) => {
  return z.literal(message).openapi({ example: message }) as z.ZodLiteral<T>;
};

export const responseStatus = (status: HttpStatusCodeType) => {
  return z.number().openapi({ example: status });
};
