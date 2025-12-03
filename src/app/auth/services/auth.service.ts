/**
 * Authentication Service
 * Centralized service for all authentication-related API calls
 */

import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth";
import type {
  LoginDto,
  RefreshTokenDto,
  LogoutDto,
} from "@/app/auth/types/auth-dto.type";
import { User } from "@/app/(core)/iam/users/_lib/_types/user.type";

/**
 * Login with username and password
 */
export async function login(dto: LoginDto): Promise<Response> {
  return fetchWithAuth(getBackendUrl(AUTH_ENDPOINTS.login), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(dto),
  });
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(dto: RefreshTokenDto): Promise<Response> {
  return fetchWithAuth(getBackendUrl(AUTH_ENDPOINTS.refresh), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(dto),
  });
}

/**
 * Logout - revoke refresh token and blacklist access token
 */
export async function logout(dto: LogoutDto): Promise<Response> {
  return fetchWithAuth(getBackendUrl(AUTH_ENDPOINTS.logout), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(dto),
  });
}

/**
 * Logout from all devices
 */
export async function logoutAll(): Promise<Response> {
  return fetchWithAuth(getBackendUrl(AUTH_ENDPOINTS.logoutAll), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

/**
 * Get current user from token
 */
export async function getCurrentUser(): Promise<User> {
  return fetchWithAuth(getBackendUrl(AUTH_ENDPOINTS.me), { method: "GET" });
}

/**
 * Check password strength
 */
export async function checkPasswordStrength(
  password: string
): Promise<Response> {
  return fetchWithAuth(getBackendUrl(AUTH_ENDPOINTS.checkPasswordStrength), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ password }),
  });
}

/**
 * Reset user password (Admin only)
 */
export async function resetPassword(
  userId: string,
  newPassword: string
): Promise<Response> {
  return fetchWithAuth(getBackendUrl(AUTH_ENDPOINTS.resetPassword), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ userId, newPassword }),
  });
}
