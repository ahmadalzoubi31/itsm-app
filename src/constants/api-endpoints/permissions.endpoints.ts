/**
 * Permissions API Endpoints
 * Centralized configuration for all permission-related endpoints
 * Aligned with backend controller: /iam/permissions
 */

export const PERMISSIONS_ENDPOINTS = {
  base: "/api/v1/iam/permissions",
  rolesGetPermissions: (roleId: string) =>
    `/api/v1/iam/permissions/roles/${roleId}`,
  rolesAssignPermissions: (roleId: string) =>
    `/api/v1/iam/permissions/roles/${roleId}/assign`,
  rolesRevokePermissions: (roleId: string) =>
    `/api/v1/iam/permissions/roles/${roleId}/revoke`,
  usersGetPermissions: (userId: string) =>
    `/api/v1/iam/permissions/users/${userId}`,
  usersAssignPermissions: (userId: string) =>
    `/api/v1/iam/permissions/users/${userId}/assign`,
  usersRevokePermissions: (userId: string) =>
    `/api/v1/iam/permissions/users/${userId}/revoke`,
} as const;
