/**
 * Roles API Endpoints
 * Centralized configuration for all role-related endpoints
 */

export const ROLES_ENDPOINTS = {
  base: "/api/v1/iam/roles",
  byId: (id: string) => `/api/v1/iam/roles/${id}`,
  usersAssignRoles: (userId: string) =>
    `/api/v1/iam/roles/users/${userId}/assign`,
  usersRevokeRole: (userId: string, roleId: string) =>
    `/api/v1/iam/roles/users/${userId}/revoke/${roleId}`,
} as const;
