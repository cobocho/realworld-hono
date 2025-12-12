export interface JwtPayload {
  sessionID: string;
  userId: string;
  exp: number;
  iat: number;
}
