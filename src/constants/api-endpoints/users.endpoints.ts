/**
 * Users API Endpoints
 * Centralized configuration for all user-related endpoints
 */

export const USERS_ENDPOINTS = {
  base: "/api/v1/iam/users",
  byId: (id: string) => `/api/v1/iam/users/${id}`,
  // effectivePermissions: (userId: string) =>
  // `/api/v1/iam/permissions/users/${userId}/permissions`,
  // userPermissions: (userId: string) =>
  // `/api/v1/iam/permissions/users/${userId}/permissions`,
  // userGroups: (userId: string) => `/api/v1/iam/users/${userId}/groups`,
} as const;
