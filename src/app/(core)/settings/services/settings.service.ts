// services/settings.service.ts

import { ApiResponse } from "@/types/globals";
import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { LdapSettings, SyncSettings } from "../ldap/types";
import { Settings } from "../types";

// Fetch LDAP settings
export async function fetchLdapSettings(): Promise<ApiResponse<LdapSettings>> {
  const res = await fetchWithAuth(getBackendUrl("/api/settings/LDAP"), {
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch ldap settings");
  }

  return res.json();
}

// Save (upsert) LDAP settings
export async function saveLdapSettings(
  payload: Partial<LdapSettings>
): Promise<ApiResponse<LdapSettings>> {
  const body = { type: "LDAP", jsonValue: payload };
  const res = await fetchWithAuth(getBackendUrl("/api/settings"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to create ldap settings");
  }
  return res.json();
}

// Fetch Sync settings
export async function fetchSyncSettings(): Promise<ApiResponse<SyncSettings>> {
  const res = await fetchWithAuth(getBackendUrl("/api/settings/SYNC"), {
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to fetch sync settings");
  }

  return res.json();
}

// Save (upsert) Sync settings
export async function saveSyncSettings(
  payload: Partial<SyncSettings>
): Promise<ApiResponse<SyncSettings>> {
  const body = { type: "SYNC", jsonValue: payload };
  const res = await fetchWithAuth(getBackendUrl("/api/settings"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to create sync settings");
  }
  return res.json();
}
