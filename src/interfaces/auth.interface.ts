export interface JwtPayload {
  sub: number;
  email: string;
  roles: string[];
}

export interface AuthenticatedUser {
  userId: number;
  email: string;
  roles: string[];
}
