import { User } from "@/app/(core)/iam/users/_lib/_types";

export type RefreshToken = {
  id: string;
  userId: string;
  token: string; // hashed refresh token
  expiresAt: Date;
  isRevoked: boolean;
  userAgent?: string;
  ipAddress?: string;
  lastUsedAt?: Date;
  createdAt: Date;
  user: User;
}

export type TokenBlacklist = {
  id: string;
  jti: string; // JWT ID - unique identifier for the token
  userId: string;
  user: User;
  expiresAt: Date;
  reason: string; // 'logout' | 'admin_revoke' | 'security' | 'password_reset'
  revokedAt: Date;
}
