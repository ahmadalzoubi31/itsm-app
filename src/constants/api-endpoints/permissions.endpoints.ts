/**
 * Permissions API Endpoints
 * Centralized configuration for all permission-related endpoints
 * Aligned with backend controller: /iam/permissions
 */

export const PERMISSIONS_ENDPOINTS = {
  base: "/api/v1/iam/permissions",
  // User Permission endpoints
  assignPermissionsToUser: (userId: string) =>
    `/api/v1/iam/permissions/users/${userId}/assign`,
  revokePermissionFromUser: (userId: string, permissionId: string) =>
    `/api/v1/iam/permissions/users/${userId}/revoke/${permissionId}`,
  getUserPermissions: (userId: string) =>
    `/api/v1/iam/permissions/users/${userId}`,
} as const;
