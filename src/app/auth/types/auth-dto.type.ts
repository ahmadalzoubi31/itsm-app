export type LoginDto = {
  username: string;
  password: string;
}

export type RefreshTokenDto = {
  refreshToken: string;
}

export type LogoutDto = {
  refreshToken: string;
}

export type ResetPasswordDto = {
  userId: string;
  newPassword: string;
}

export type CheckPasswordStrengthDto = {
  password: string;
}

export type PasswordStrengthResponseDto = {
  isValid: boolean;
  errors: string[];
  score: number;
  strength: string;
}
