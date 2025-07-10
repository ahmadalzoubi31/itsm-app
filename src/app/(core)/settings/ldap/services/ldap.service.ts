// services/ldap.service.ts

import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { ApiResponse } from "@/types/globals";
import { LdapSettings } from "../types";

// Test ldap connection (expects payload: LdapSettings or Partial<LdapSettings>)
export async function testLdapConnection(
  payload: Partial<LdapSettings>
): Promise<ApiResponse<boolean>> {
  const body = { type: "LDAP", jsonValue: payload };

  const res = await fetchWithAuth(getBackendUrl("/api/ldap/test"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Connection Failed");
  }
  return res.json();
}

// Fetch sample LDAP users
export async function showSample(): Promise<ApiResponse<any>> {
  const res = await fetchWithAuth(getBackendUrl("/api/ldap/preview"), {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to show sample");
  }
  return res.json();
}

// Sync LDAP users (expects response: AD-Entry[])
export async function syncLdapUsers(): Promise<ApiResponse<any>> {
  const res = await fetchWithAuth(getBackendUrl("/api/ldap/sync"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isManualSync: true }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to sync users");
  }
  return res.json();
}

// Cancel ongoing LDAP sync operation
export async function cancelLdapSync(): Promise<ApiResponse<any>> {
  const res = await fetchWithAuth(getBackendUrl("/api/ldap/sync/cancel"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to cancel sync operation");
  }
  return res.json();
}
