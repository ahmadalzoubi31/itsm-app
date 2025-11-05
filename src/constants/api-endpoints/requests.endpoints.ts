/**
 * Service Requests API Endpoints
 * Centralized configuration for all service request-related endpoints
 */

export const REQUESTS_ENDPOINTS = {
  base: "/api/service-requests",
  byId: (id: string) => `/api/service-requests/${id}`,
} as const;
