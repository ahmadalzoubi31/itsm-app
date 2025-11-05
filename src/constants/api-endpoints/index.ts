/**
 * API Endpoints - Centralized Configuration
 *
 * This file exports all API endpoint configurations organized by module.
 *
 * Usage Examples:
 *   // Import specific endpoints:
 *   import { AUTH_ENDPOINTS } from "@/constants/api-endpoints";
 *   import { CATALOG_ENDPOINTS } from "@/constants/api-endpoints";
 *
 *   // Or import the combined object:
 *   import { API_ENDPOINTS } from "@/constants/api-endpoints";
 *   const endpoint = API_ENDPOINTS.auth.signIn;
 */

// Re-export all endpoint modules
export { AUTH_ENDPOINTS } from "./auth.endpoints";
export { USERS_ENDPOINTS } from "./users.endpoints";
export { GROUPS_ENDPOINTS } from "./groups.endpoints";
export { PERMISSIONS_ENDPOINTS } from "./permissions.endpoints";
export { CATALOG_ENDPOINTS } from "./catalog.endpoints";
export { REQUESTS_ENDPOINTS } from "./requests.endpoints";
export { EMAIL_ENDPOINTS } from "./email.endpoints";
export { LDAP_ENDPOINTS } from "./ldap.endpoints";
export { SETTINGS_ENDPOINTS } from "./settings.endpoints";
export { ROLES_ENDPOINTS } from "./roles.endpoints";

// Import for combined object
import { AUTH_ENDPOINTS } from "./auth.endpoints";
import { USERS_ENDPOINTS } from "./users.endpoints";
import { GROUPS_ENDPOINTS } from "./groups.endpoints";
import { PERMISSIONS_ENDPOINTS } from "./permissions.endpoints";
import { CATALOG_ENDPOINTS } from "./catalog.endpoints";
import { REQUESTS_ENDPOINTS } from "./requests.endpoints";
import { EMAIL_ENDPOINTS } from "./email.endpoints";
import { LDAP_ENDPOINTS } from "./ldap.endpoints";
import { SETTINGS_ENDPOINTS } from "./settings.endpoints";
import { ROLES_ENDPOINTS } from "./roles.endpoints";

/**
 * Combined API_ENDPOINTS object for convenient access
 * Use: API_ENDPOINTS.auth.signIn, API_ENDPOINTS.users.base, etc.
 */
export const API_ENDPOINTS = {
  auth: AUTH_ENDPOINTS,
  users: USERS_ENDPOINTS,
  groups: GROUPS_ENDPOINTS,
  permissions: PERMISSIONS_ENDPOINTS,
  catalog: CATALOG_ENDPOINTS,
  requests: REQUESTS_ENDPOINTS,
  email: EMAIL_ENDPOINTS,
  ldap: LDAP_ENDPOINTS,
  settings: SETTINGS_ENDPOINTS,
  roles: ROLES_ENDPOINTS,
} as const;
