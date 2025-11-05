/**
 * Settings API Endpoints
 * Centralized configuration for all settings-related endpoints
 */

export const SETTINGS_ENDPOINTS = {
  ldap: "/api/settings/LDAP",
  sync: "/api/settings/SYNC",
  email: "/api/settings/EMAIL",
  emailNotifications: "/api/settings/EMAIL_NOTIFICATIONS",
} as const;
