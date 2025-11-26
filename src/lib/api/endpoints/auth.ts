/**
 * Authentication API Endpoints
 * Centralized configuration for all authentication-related endpoints
 *
 * Backend controller: IAM / Auth
 * Path: /api/v1/iam/auth
 */

export const AUTH_ENDPOINTS = {
    login: "/api/v1/iam/auth/login",
    refresh: "/api/v1/iam/auth/refresh",
    logout: "/api/v1/iam/auth/logout",
    logoutAll: "/api/v1/iam/auth/logout-all",
    me: "/api/v1/iam/auth/me",
    checkPasswordStrength: "/api/v1/iam/auth/check-password-strength",
    resetPassword: "/api/v1/iam/auth/reset-password",

    // Legacy aliases for backward compatibility (can be removed after migration)
    signIn: "/api/v1/iam/auth/login",
    signOut: "/api/v1/iam/auth/logout",
    refreshToken: "/api/v1/iam/auth/refresh",
} as const;
