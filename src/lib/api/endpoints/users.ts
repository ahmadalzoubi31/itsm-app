/**
 * Users API Endpoints
 * Centralized configuration for all user-related endpoints
 */

export const USERS_ENDPOINTS = {
    base: "/api/v1/iam/users",
    byId: (id: string) => `/api/v1/iam/users/${id}`,
} as const;


