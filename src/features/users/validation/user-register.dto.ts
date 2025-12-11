import { z } from 'zod';

export const userRegisterSchema = z.object({
  user: z.object({
    username: z
      .string()
      .min(3, {
        message: 'Username must be at least 3 characters long',
      })
      .max(20, {
        message: 'Username must be at most 20 characters long',
      }),
    email: z.email(),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters long',
    }),
  }),
});

export type UserRegisterDto = z.infer<typeof userRegisterSchema>;

export const userRegisterResponseSchema = z.object({
  username: z.string().openapi({ example: 'john_doe' }),
  email: z.string().openapi({ example: 'john.doe@example.com' }),
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
});

export type UserRegisterResponseDto = z.infer<
  typeof userRegisterResponseSchema
>;
