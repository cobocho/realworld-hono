import { z } from 'zod';

export const userSchema = z.object({
  user_id: z
    .uuid()
    .openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  email: z
    .email('Invalid email address')
    .openapi({ example: 'john.doe@example.com' }),
  hash_password: z
    .string('Invalid hash password')
    .min(8, { message: 'Password must be at least 8 characters long' })
    .openapi({ example: 'password' }),
  username: z
    .string('Invalid username')
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' })
    .openapi({ example: 'john_doe' }),
  bio: z
    .string()
    .max(100, { message: 'Bio must be at most 100 characters long' })
    .nullable()
    .openapi({ example: 'I am a software engineer' }),
  image: z
    .url('Invalid image URL')
    .nullable()
    .openapi({ example: 'https://example.com/image.jpg' }),
  created_at: z.date().openapi({ example: '2021-01-01' }),
  updated_at: z.date().openapi({ example: '2021-01-01' }),
});
