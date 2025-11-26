/**
 * API endpoints for cases module
 */
export const CASES_ENDPOINTS = {
  base: "/api/v1/cases",
  byId: (id: string) => `/api/v1/cases/${id}`,
  byNumber: (number: string) => `/api/v1/cases/number/${number}`,
  create: "/api/v1/cases",
  update: (id: string) => `/api/v1/cases/${id}`,
  assign: (id: string) => `/api/v1/cases/${id}/assign`,
  changeStatus: (id: string) => `/api/v1/cases/${id}/status`,

  // Comments
  comments: (id: string) => `/api/v1/cases/${id}/comments`,
  addComment: (id: string) => `/api/v1/cases/${id}/comments`,

  // Attachments
  attachments: (id: string) => `/api/v1/cases/${id}/attachments`,
  uploadAttachment: (id: string) => `/api/v1/cases/${id}/attachments`,

  // Timeline
  timeline: (id: string) => `/api/v1/cases/${id}/timeline`,
} as const;
