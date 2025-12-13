import { z } from 'zod';

import { userSchema } from '@core/db/schema';

export const getProfileSchema = z.object({
  userId: userSchema.shape.user_id,
});

export type GetProfileDto = z.infer<typeof getProfileSchema>;

export const getProfileResponseSchema = z.object({
  email: userSchema.shape.email,
  username: userSchema.shape.username,
  bio: userSchema.shape.bio,
  image: userSchema.shape.image,
  following: z.boolean(),
});

export type GetProfileResponseDto = z.infer<typeof getProfileResponseSchema>;
