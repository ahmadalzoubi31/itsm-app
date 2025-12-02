/**
 * Settings API Endpoints
 * Centralized configuration for all settings-related endpoints
 */

export const SETTINGS_ENDPOINTS = {
  email: "/api/v1/settings/email",
  emailNotifications: "/api/v1/settings/email-notifications",
  emailChannels: {
    base: "/api/v1/admin/email/channels",
    byId: (id: string) => `/api/v1/admin/email/channels/${id}`,
    testConnection: (id: string) => `/api/v1/admin/email/channels/${id}/test`,
    simulateIncoming: (id: string) =>
      `/api/v1/admin/email/channels/${id}/simulate-incoming`,
  },
  emailMessages: {
    base: "/api/v1/admin/email/messages",
    byId: (id: string) => `/api/v1/admin/email/messages/${id}`,
    byCaseId: (caseId: string) => `/api/v1/admin/email/messages/case/${caseId}`,
  },
  emailRules: {
    base: "/api/v1/admin/email/rules",
    byId: (id: string) => `/api/v1/admin/email/rules/${id}`,
  },
  emailTemplates: {
    base: "/api/v1/admin/email/templates",
    byId: (id: string) => `/api/v1/admin/email/templates/${id}`,
  },
} as const;
