import { zValidator } from '@hono/zod-validator';
import { ValidationTargets } from 'hono';
import z from 'zod';

import { ValidationError } from '@shared/error/errors';

export const zv = <T extends z.ZodTypeAny>(
  target: keyof ValidationTargets,
  schema: T
) => {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      const errorMessage = result.error.issues
        .map(issue => issue.message)
        .join(', ');

      throw new ValidationError(errorMessage);
    }
  });
};
