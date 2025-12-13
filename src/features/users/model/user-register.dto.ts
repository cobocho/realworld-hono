import { z } from 'zod';

import { userSchema } from '@core/db/zod-schema';

export const userRegisterSchema = z.object({
  user: z.object({
    username: userSchema.shape.username,
    email: userSchema.shape.email,
    password: userSchema.shape.hash_password,
  }),
});

export type UserRegisterDto = z.infer<typeof userRegisterSchema>;

export const userRegisterResponseSchema = userSchema.omit({
  hash_password: true,
});

export type UserRegisterResponseDto = z.infer<
  typeof userRegisterResponseSchema
>;
