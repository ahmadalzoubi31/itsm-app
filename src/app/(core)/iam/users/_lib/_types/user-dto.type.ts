import type { AuthSource, User } from "./user.type";

export type CreateUserDto = {
  authSource?: AuthSource;
  externalId?: string;
  password?: string;
} & Pick<
  User,
  "username" | "email" | "displayName" | "isActive" | "isLicensed"
>;

export type UpdateUserDto = Partial<
  Pick<User, "email" | "displayName" | "isActive" | "isLicensed" | "password">
>;

export type PasswordStrengthResponseDto = {
  isValid: boolean;
  errors: string[];
  score: number;
  strength: string;
};
