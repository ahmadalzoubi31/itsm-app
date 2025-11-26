/**
 * Catalog API Endpoints
 * Centralized configuration for all catalog-related endpoints
 */

export const SERVICES_ENDPOINTS = {
  base: "/api/v1/catalog/services",
  byId: (id: string) => `/api/v1/catalog/services/${id}`,
} as const;

export const REQUEST_CARDS_ENDPOINTS = {
  base: "/api/v1/catalog/request-cards",
  byId: (id: string) => `/api/v1/catalog/request-cards/${id}`,
  // For backward compatibility, these use byId but with different HTTP methods
  updateRequestCard: (id: string) => `/api/v1/catalog/request-cards/${id}`,
  submit: (id: string) => `/api/v1/catalog/request-cards/${id}/submit`,
  // This is used by the service but should use SERVICES_ENDPOINTS.requestCardsByService
  // Kept for backward compatibility
  requestCardsByService: (serviceId: string) =>
    `/api/v1/catalog/services/${serviceId}/request-cards`,
  dropdownOptions: "/api/v1/catalog/dropdown-options",
} as const;

export const CATALOG_ENDPOINTS = {
  submitRequestCard: (id: string) =>
    `/api/v1/catalog/request-cards/${id}/submit`,
} as const;
