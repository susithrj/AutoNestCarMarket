export type Role = 'ADMIN' | 'BUYER';

export interface AuthResponse {
  accessToken: string;
  expiresInSeconds: number;
  userId: number;
  email: string;
  role: Role;
}

