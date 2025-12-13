import { z } from 'zod';

export const editUserSchema = z.object({
  user: z.object({
    email: z
      .email('Invalid email address')
      .optional()
      .openapi({ example: 'john.doe@example.com' }),
    bio: z.string().optional().openapi({ example: 'I am a software engineer' }),
    image: z
      .url('Invalid image URL')
      .optional()
      .openapi({ example: 'https://example.com/image.jpg' }),
  }),
});

export type EditUserDto = z.infer<typeof editUserSchema>;
