import { AuthSource } from "./user.interface";

export interface CreateUserDto {
  username: string;
  email?: string;
  displayName: string;
  authSource: AuthSource;
  externalId?: string; // For LDAP users
  isActive: boolean;
  password?: string; // Required for local users
}

export interface UpdateUserDto {
  email?: string;
  displayName?: string;
  isActive?: boolean;
  password?: string; // Optional - only if changing password
}

export interface PasswordStrengthResponseDto {
  isValid: boolean;
  errors: string[];
  score: number;
  strength: string;
}
