// services/sync.service.ts

import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { StagedUser } from "../types";
import { LDAP_ENDPOINTS } from "@/lib/api/endpoints/ldap";

// Get the executed sync history
export async function getStagedUsers(): Promise<StagedUser[]> {
  return await fetchWithAuth(getBackendUrl(LDAP_ENDPOINTS.stagedUsers));
}

// Import staged users to real user form
export async function importUsers(
  ids: string[],
  configId?: string
): Promise<{ imported: number; failed: number; errors: string[] }> {
  const url = new URL(getBackendUrl(LDAP_ENDPOINTS.importUsers));
  if (configId) {
    url.searchParams.set("configId", configId);
  }

  return await fetchWithAuth(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
  });
}

// Reject staged users
export async function rejectUsers(
  ids: string[],
  reason?: string
): Promise<{ rejected: number; failed: number; errors: string[] }> {
  return await fetchWithAuth(getBackendUrl(LDAP_ENDPOINTS.rejectUsers), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, reason }),
  });
}
