/**
 * Service Requests API Endpoints
 * Centralized configuration for all service request-related endpoints
 */

export const REQUESTS_ENDPOINTS = {
  base: "/api/v1/requests",
  byId: (id: string) => `/api/v1/requests/${id}`,
  byLinkedCase: (caseId: string) => `/api/v1/requests/by-linked-case/${caseId}`,
  create: "/api/v1/requests",
  update: (id: string) => `/api/v1/requests/${id}`,
  assign: (id: string) => `/api/v1/requests/${id}/assign`,
  resolve: (id: string) => `/api/v1/requests/${id}/resolve`,
  // Comments
  comments: (id: string) => `/api/v1/requests/${id}/comments`,
  addComment: (id: string) => `/api/v1/requests/${id}/comments`,
  // Attachments
  attachments: (id: string) => `/api/v1/requests/${id}/attachments`,
  uploadAttachment: (id: string) => `/api/v1/requests/${id}/attachments`,
  approvals: {
    pending: "/api/v1/requests/approvals/pending",
    approve: (id: string) => `/api/v1/requests/${id}/approve`,
    reject: (id: string) => `/api/v1/requests/${id}/reject`,
  },
} as const;
