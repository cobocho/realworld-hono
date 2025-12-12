import { z } from 'zod';

export const userLoginSchema = z.object({
  user: z.object({
    email: z.email().openapi({ example: 'john.doe@example.com' }),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters long',
      })
      .openapi({ example: 'password' }),
  }),
});

export type UserLoginDto = z.infer<typeof userLoginSchema>;

export const userLoginResponseSchema = z.object({
  email: z.string().openapi({ example: 'john.doe@example.com' }),
  username: z.string().openapi({ example: 'john_doe' }),
  bio: z
    .string()
    .nullable()
    .optional()
    .openapi({ example: 'I am a software engineer' }),
  image: z
    .string()
    .nullable()
    .optional()
    .openapi({ example: 'https://example.com/image.jpg' }),
  token: z.string().openapi({ example: 'token' }),
});

export type UserLoginResponseDto = z.infer<typeof userLoginResponseSchema>;
