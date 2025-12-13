import { z } from 'zod';

export const jwtPayloadSchema = z.object({
  sessionID: z.string(),
  userId: z.string(),
  exp: z.number(),
  iat: z.number(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export const isJwtPayload = (payload: unknown): payload is JwtPayload => {
  return jwtPayloadSchema.safeParse(payload).success;
};
