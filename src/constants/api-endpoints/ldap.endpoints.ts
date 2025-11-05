/**
 * LDAP API Endpoints
 * Centralized configuration for all LDAP-related endpoints
 */

export const LDAP_ENDPOINTS = {
  test: "/api/ldap/test",
  preview: "/api/ldap/preview",
  sync: "/api/ldap/sync",
  syncCancel: "/api/ldap/sync/cancel",
  syncHistory: "/api/ldap/sync-history",
  stagedUsers: "/api/ldap/staged-users",
  importUsers: "/api/ldap/import-users",
  rejectUsers: "/api/ldap/reject-users",
} as const;
