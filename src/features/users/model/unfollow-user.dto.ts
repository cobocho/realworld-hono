import { z } from 'zod';

import { userSchema } from '@core/db/zod-schema';

export const unfollowUserParamsSchema = z.object({
  userId: userSchema.shape.user_id,
});

export type UnfollowUserParamsDto = z.infer<typeof unfollowUserParamsSchema>;

export const unfollowUserResponseSchema = userSchema.omit({
  hash_password: true,
});

export type UnfollowUserResponseDto = z.infer<
  typeof unfollowUserResponseSchema
>;
