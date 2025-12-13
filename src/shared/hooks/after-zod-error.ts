import type { Context } from 'hono';
import { ZodError, z } from 'zod';

import { ValidationError } from '@shared/error/errors';

export const zodErrorSchema = z.object({
  message: z.string().openapi({ example: 'Validation error' }),
  status: z.number().openapi({ example: 400 }),
  errors: z.array(
    z
      .object({
        field: z.string().openapi({ example: 'user.username' }),
        message: z
          .string()
          .openapi({ example: 'Username must be at least 3 characters long' }),
      })
      .optional()
  ),
});

export const afterZodErrorHook = (
  result:
    | {
        success: false;
        error: ZodError;
      }
    | {
        success: true;
        data: unknown;
      },
  c: Context
) => {
  if (!result.success) {
    throw new ValidationError('Validation error', result.error.issues);
  }
};
