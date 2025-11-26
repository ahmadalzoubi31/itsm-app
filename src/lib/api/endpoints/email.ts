/**
 * Email API Endpoints
 * Centralized configuration for all email-related endpoints
 */

export const EMAIL_ENDPOINTS = {
  templates: {
    base: "/api/email/templates",
    byId: (id: string) => `/api/email/templates/${id}`,
  },
  testConnection: "/api/email/test-connection",
  sendTest: "/api/email/send-test",
  statistics: "/api/email/statistics",
  oauth: {
    authUrl: (provider: string) => `/api/email/oauth/${provider}/auth-url`,
    exchange: (provider: string) => `/api/email/oauth/${provider}/exchange`,
  },
  queue: {
    base: "/api/email/queue",
  },
  retryFailed: "/api/email/retry-failed",
} as const;
