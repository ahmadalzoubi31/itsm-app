/**
 * LDAP API Endpoints
 * Centralized configuration for all LDAP-related endpoints
 */

export const LDAP_ENDPOINTS = {
  base: "/api/v1/settings/ldap",
  config: "/api/v1/settings/ldap/config",
  byId: "/api/v1/settings/ldap/config/:id",
  testConnection: "/api/v1/settings/ldap/config/:id/test",
  syncStart: "/api/v1/settings/ldap/config/:id/sync",
  syncStatus: "/api/v1/settings/ldap/sync/:syncId",
  syncHistory: "/api/v1/settings/ldap/config/:id/sync-history",
  syncCancel: "/api/v1/settings/ldap/sync/cancel",
  sample: "/api/v1/settings/ldap/sample",
  stagedUsers: "/api/v1/settings/ldap/staged-users",
  importUsers: "/api/v1/settings/ldap/import-users",
  rejectUsers: "/api/v1/settings/ldap/reject-users",
} as const;
