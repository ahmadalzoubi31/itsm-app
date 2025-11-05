/**
 * Catalog/Service Cards API Endpoints
 * Centralized configuration for all catalog and service card-related endpoints
 */

export const CATALOG_ENDPOINTS = {
  serviceCards: {
    base: "/api/service-cards",
    byId: (id: string) => `/api/service-cards/${id}`,
  },
  serviceCategories: {
    base: "/api/service-categories",
  },
  approvalWorkflows: {
    base: "/api/approval-workflows",
  },
  slas: {
    base: "/api/slas",
  },
} as const;
