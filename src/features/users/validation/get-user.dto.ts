import { z } from 'zod';

export const getUserResponseSchema = z.object({
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
});

export type GetUserResponseDto = z.infer<typeof getUserResponseSchema>;
