/**
 * Catalog API Endpoints
 * Centralized configuration for all catalog-related endpoints
 */

export const CATEGORIES_ENDPOINTS = {
  base: "/api/v1/case-categories",
  byId: (id: string) => `/api/v1/case-categories/${id}`,
  updateCategory: (id: string) => `/api/v1/case-categories/${id}`,
  subcategories: {
    base: "/api/v1/case-subcategories",
    byId: (id: string) => `/api/v1/case-subcategories/${id}`,
    list: (categoryId?: string) =>
      categoryId
        ? `/api/v1/case-subcategories?categoryId=${categoryId}`
        : "/api/v1/case-subcategories",
  },
} as const;
