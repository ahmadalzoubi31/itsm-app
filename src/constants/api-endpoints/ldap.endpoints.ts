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
} as const;
