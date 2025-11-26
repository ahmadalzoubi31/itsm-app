import { User } from "@/lib/types/globals";

export interface RefreshToken {
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

export interface TokenBlacklist {
  id: string;
  jti: string; // JWT ID - unique identifier for the token
  userId: string;
  user: User;
  expiresAt: Date;
  reason: string; // 'logout' | 'admin_revoke' | 'security' | 'password_reset'
  revokedAt: Date;
}
