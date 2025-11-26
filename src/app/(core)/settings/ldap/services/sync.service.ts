// services/sync.service.ts

import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { SyncHistory, BasicInfo } from "../types";
import { SyncStatusEnum } from "../constants/sync-status.constant";
import { LDAP_ENDPOINTS } from "@/lib/api/endpoints";
import { saveLdapSettings } from "./ldap.service";

// Save sync settings (same as saving BasicInfo since sync settings are part of BasicInfo)
export async function saveBasicInfo(
  payload: Partial<BasicInfo>
): Promise<BasicInfo> {
  return saveLdapSettings(payload);
}

// Sync LDAP users (expects configId parameter)
export async function syncLdapUsers(configId: string): Promise<any> {
  if (!configId) {
    throw new Error("Configuration ID is required to start sync");
  }

  const endpoint = LDAP_ENDPOINTS.syncStart.replace(":id", configId);
  return await fetchWithAuth(getBackendUrl(endpoint), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
}

// Cancel ongoing LDAP sync operation
export async function cancelLdapSync(configId?: string): Promise<any> {
  const url = new URL(getBackendUrl(LDAP_ENDPOINTS.syncCancel));
  if (configId) {
    url.searchParams.append("configId", configId);
  }
  return await fetchWithAuth(url.toString(), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
}

// Get sync status by syncId
export async function getSyncStatus(syncId: string): Promise<any> {
  if (!syncId) {
    throw new Error("Sync ID is required to get sync status");
  }

  // Backend uses :id parameter, but endpoint constant uses :syncId
  const endpoint = LDAP_ENDPOINTS.syncStatus.replace(":syncId", syncId);
  const data = await fetchWithAuth(getBackendUrl(endpoint), {
    credentials: "include",
  });

  // Transform timestamps from strings to Date objects
  return {
    ...data,
    syncStartTime: data.syncStartTime ? new Date(data.syncStartTime) : null,
    syncEndTime: data.syncEndTime ? new Date(data.syncEndTime) : null,
  };
}

// Get the executed sync history
export async function getSyncHistory(
  configId: string
): Promise<Array<SyncHistory>> {
  if (!configId) {
    throw new Error("Configuration ID is required to get sync history");
  }

  const endpoint = LDAP_ENDPOINTS.syncHistory.replace(":id", configId);
  const data = await fetchWithAuth(getBackendUrl(endpoint), {
    credentials: "include",
  });

  // Transform backend LdapSyncLog to frontend SyncHistory format
  return (data || []).map((entry: any) => {
    // Map backend status to frontend enum
    let status: SyncStatusEnum;
    switch (entry.status?.toLowerCase()) {
      case "completed":
        status = SyncStatusEnum.SUCCESS;
        break;
      case "failed":
        status = SyncStatusEnum.ERROR;
        break;
      case "in_progress":
        status = SyncStatusEnum.IN_PROGRESS;
        break;
      case "cancelled":
        status = SyncStatusEnum.ERROR; // Treat cancelled as error
        break;
      default:
        status = SyncStatusEnum.ERROR;
    }

    // Create details message from errorDetails or status summary
    let details = entry.errorDetails || "";
    if (!details) {
      if (entry.status === "completed") {
        details = `Sync completed successfully.`;
      } else if (entry.status === "failed") {
        details = "Sync failed. Check error details for more information.";
      } else if (entry.status === "cancelled") {
        details = "Sync was cancelled.";
      } else {
        details = `Sync ${entry.status || "unknown"}`;
      }
    }

    return {
      id: entry.id,
      timestamp: entry.syncStartTime
        ? new Date(entry.syncStartTime)
        : new Date(),
      status,
      details,
      usersFetched: entry.usersProcessed,
      duration: entry.durationMs
        ? Math.round(entry.durationMs / 1000)
        : undefined,
      // Include backend fields for compatibility
      syncStartTime: entry.syncStartTime
        ? new Date(entry.syncStartTime)
        : undefined,
      syncEndTime: entry.syncEndTime ? new Date(entry.syncEndTime) : undefined,
      usersProcessed: entry.usersProcessed,
      usersAdded: entry.usersAdded,
      usersUpdated: entry.usersUpdated,
      usersDeactivated: entry.usersDeactivated,
      usersSkipped: entry.usersSkipped,
      errors: entry.errors,
      durationMs: entry.durationMs,
      errorDetails: entry.errorDetails,
      trigger: entry.trigger,
    };
  });
}
