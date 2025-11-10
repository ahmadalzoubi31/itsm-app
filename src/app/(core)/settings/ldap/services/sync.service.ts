// services/sync.service.ts

import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { SyncHistory } from "../types";

// Sync LDAP users (expects response: AD-Entry[])
export async function syncLdapUsers(): Promise<any> {
  const res = await fetchWithAuth(getBackendUrl("/api/ldap/sync"), {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to sync users");
  }
  return res.json();
}

// Get the executed sync history
export async function getSyncHistory(): Promise<Array<SyncHistory>> {
  const res = await fetchWithAuth(getBackendUrl("/api/ldap/sync-history"), {
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to get sync history");
  }
  return res.json() as Promise<Array<SyncHistory>>;
}
