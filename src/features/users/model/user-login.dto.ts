import { z } from 'zod';

import { userSchema } from '@core/db/zod-schema';

export const userLoginSchema = z.object({
  user: z.object({
    email: userSchema.shape.email,
    password: userSchema.shape.hash_password,
  }),
});

export type UserLoginDto = z.infer<typeof userLoginSchema>;

export const userLoginResponseSchema = z.object({
  email: userSchema.shape.email,
  username: userSchema.shape.username,
  bio: userSchema.shape.bio,
  image: userSchema.shape.image,
  token: z.string().openapi({ example: 'token' }),
});

export type UserLoginResponseDto = z.infer<typeof userLoginResponseSchema>;
