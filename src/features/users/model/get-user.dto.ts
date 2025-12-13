import { z } from 'zod';

import { userSchema } from '@core/db/zod-schema';

export const getUserResponseSchema = userSchema.omit({
  hash_password: true,
});

export type GetUserResponseDto = z.infer<typeof getUserResponseSchema>;
