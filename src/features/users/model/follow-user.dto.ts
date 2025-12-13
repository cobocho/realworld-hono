import { z } from 'zod';

import { userSchema } from '@core/db/zod-schema';

export const followUserParamsSchema = z.object({
  userId: userSchema.shape.user_id,
});

export type FollowUserParamsDto = z.infer<typeof followUserParamsSchema>;

export const followUserResponseSchema = userSchema.omit({
  hash_password: true,
});

export type FollowUserResponseDto = z.infer<typeof followUserResponseSchema>;
