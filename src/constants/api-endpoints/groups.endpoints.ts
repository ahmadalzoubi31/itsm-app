/**
 * Groups API Endpoints
 * Centralized configuration for all group-related endpoints
 */

export const GROUPS_ENDPOINTS = {
  base: "/api/groups",
  byId: (id: string) => `/api/groups/${id}`,
  members: (groupId: string) => `/api/groups/${groupId}/members`,
  memberBatch: (groupId: string) => `/api/groups/${groupId}/members/batch`,
  memberById: (groupId: string, userId: string) =>
    `/api/groups/${groupId}/members/${userId}`,
  permissions: (groupId: string) => `/api/groups/${groupId}/permissions`,
  permissionById: (groupId: string, permissionId: string) =>
    `/api/groups/${groupId}/permissions/${permissionId}`,
} as const;
