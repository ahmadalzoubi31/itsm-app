/**
 * Roles API Endpoints
 * Centralized configuration for all role-related endpoints
 */

export const ROLES_ENDPOINTS = {
  base: "/api/v1/iam/roles",
  byId: (id: string) => `/api/v1/iam/roles/${id}`,
  deleteRole: (id: string) => `/api/v1/iam/roles/${id}`,
  getRolePermissions: (id: string) => `/api/v1/iam/roles/${id}/permissions`,
  assignPermissionsToRole: (id: string) =>
    `/api/v1/iam/roles/${id}/permissions`,
  revokePermissionsFromRole: (id: string) =>
    `/api/v1/iam/roles/${id}/permissions`,
  assignRolesToUser: (userId: string) =>
    `/api/v1/iam/roles/users/${userId}/assign`,
  revokeRoleFromUser: (userId: string, roleId: string) =>
    `/api/v1/iam/roles/users/${userId}/revoke/${roleId}`,
} as const;
