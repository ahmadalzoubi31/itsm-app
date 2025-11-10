/**
 * Groups API Endpoints
 * Centralized configuration for all group-related endpoints
 */

export const GROUPS_ENDPOINTS = {
  base: "/api/v1/iam/groups",
  byId: (id: string) => `/api/v1/iam/groups/${id}`,
} as const;
