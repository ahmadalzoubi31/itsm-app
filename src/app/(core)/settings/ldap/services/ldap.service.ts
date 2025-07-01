// services/ldap.service.ts

import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { ApiResponse } from "@/types/globals";
import { LdapSettings } from "../types";

// Test ldap connection (expects payload: LdapSettings or Partial<LdapSettings>)
export async function testLdapConnection(
  payload: Partial<LdapSettings>
): Promise<ApiResponse<boolean>> {
  const res = await fetchWithAuth(getBackendUrl("/api/ldap/test"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to test ldap connection");
  }
  return res.json();
}

// Fetch sample LDAP users
export async function showSample(): Promise<ApiResponse<any>> {
  const res = await fetchWithAuth(getBackendUrl("/api/ldap/users"), {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to show sample");
  }
  return res.json();
}

// Sync LDAP users
export async function syncLdapUsers(payload: any): Promise<ApiResponse<any>> {
  const res = await fetchWithAuth(getBackendUrl("/api/ldap/sync"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to sync users");
  }
  return res.json();
}
