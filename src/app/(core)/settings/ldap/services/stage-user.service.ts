// services/sync.service.ts

import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { ApiResponse } from "@/types/globals";
import { StagedUser } from "../types";

// Get the executed sync history
export async function getStagedUsers(): Promise<
  ApiResponse<Array<StagedUser>>
> {
  const res = await fetchWithAuth(getBackendUrl("/api/ldap/staged-users"), {
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to get sync history");
  }
  return res.json();
}

// Import staged users to real user form
export async function importUsers(ids: string[]): Promise<ApiResponse<any>> {
  const res = await fetchWithAuth(
    getBackendUrl("/api/ldap/staged-users/import"),
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids),
    }
  );
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || "Failed to import users");
  }
  return res.json();
}
