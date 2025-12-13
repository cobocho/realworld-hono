import { z } from 'zod';

import { userSchema } from '@core/db/schema';

export const editUserSchema = z.object({
  user: z.object({
    email: userSchema.shape.email.optional(),
    bio: userSchema.shape.bio.optional(),
    image: userSchema.shape.image.optional(),
  }),
});

export type EditUserDto = z.infer<typeof editUserSchema>;

export const editUserResponseSchema = userSchema.omit({
  hash_password: true,
});

export type EditUserResponseDto = z.infer<typeof editUserResponseSchema>;
