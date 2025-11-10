// services/ldap.service.ts

import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { BasicInfo } from "../types";
import { LDAP_ENDPOINTS } from "@/constants/api-endpoints";

// Fetch LDAP settings
export async function fetchBasicInfo(): Promise<BasicInfo[]> {
  return await fetchWithAuth(getBackendUrl(LDAP_ENDPOINTS.config));
}

// Test ldap connection (expects payload: BasicInfo or Partial<BasicInfo>)
export async function testLdapConnection(payload: Partial<BasicInfo>): Promise<boolean> {
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
export async function showSample(): Promise<any> {
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
export async function syncLdapUsers(): Promise<any> {
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
export async function cancelLdapSync(): Promise<any> {
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
