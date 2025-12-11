import { zValidator } from '@hono/zod-validator';
import { ValidationTargets } from 'hono';
import z from 'zod';

import { ValidationError } from '@shared/error/errors';

export const zv = <T extends z.ZodTypeAny>(
  target: keyof ValidationTargets,
  schema: T
) => {
  return zValidator(target, schema, result => {
    if (!result.success) {
      const errorMessage = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      throw new ValidationError('Validation error', errorMessage);
    }
  });
};
