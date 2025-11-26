export interface LoginDto {
  username: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface LogoutDto {
  refreshToken: string;
}

export interface ResetPasswordDto {
  userId: string;
  newPassword: string;
}

export interface CheckPasswordStrengthDto {
  password: string;
}

export interface PasswordStrengthResponseDto {
  isValid: boolean;
  errors: string[];
  score: number;
  strength: string;
}
