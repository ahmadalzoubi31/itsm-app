// services/settings.service.ts

import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { BasicInfo, SyncSettings } from "../ldap/types";

// Save (upsert) LDAP settings
export async function saveLdapSettings(payload: Partial<BasicInfo>): Promise<BasicInfo> {
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
export async function fetchSyncSettings(): Promise<SyncSettings> {
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
export async function saveSyncSettings(payload: Partial<SyncSettings>): Promise<SyncSettings> {
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
