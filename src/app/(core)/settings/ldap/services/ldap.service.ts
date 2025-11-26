// services/ldap.service.ts

import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { BasicInfo, SyncSettings } from "../types";
import { LDAP_ENDPOINTS } from "@/lib/api/endpoints";
import { FrequencyEnum } from "../constants/frequency.constant";

// Transform backend sync settings to frontend format
function transformBackendToFrontendSyncSettings(backend: any): SyncSettings {
  // Ensure frequency is a valid FrequencyEnum value
  const frequency =
    backend.syncFrequency &&
    Object.values(FrequencyEnum).includes(backend.syncFrequency)
      ? backend.syncFrequency
      : FrequencyEnum.DAILY;

  return {
    id: backend.id,
    enabled: backend.syncEnabled ?? false,
    frequency,
    syncTime: backend.syncTime,
    timezone: backend.syncTimezone ?? "UTC",
    retryAttempts: backend.syncRetryAttempts ?? 3,
    retryInterval: backend.syncRetryInterval ?? 30,
    fullSyncInterval: backend.syncFullSyncInterval ?? 7,
    syncMinute: backend.syncMinute,
    daysOfWeek: backend.syncDaysOfWeek,
    daysOfMonth: backend.syncDaysOfMonth,
  };
}

// Transform frontend sync settings to backend format
function transformFrontendToBackendSyncSettings(
  frontend: Partial<SyncSettings>
): any {
  const backend: any = {};
  if (frontend.enabled !== undefined) backend.syncEnabled = frontend.enabled;
  if (frontend.frequency !== undefined)
    backend.syncFrequency = frontend.frequency;
  if (frontend.syncTime !== undefined) backend.syncTime = frontend.syncTime;
  if (frontend.timezone !== undefined) backend.syncTimezone = frontend.timezone;
  if (frontend.retryAttempts !== undefined)
    backend.syncRetryAttempts = frontend.retryAttempts;
  if (frontend.retryInterval !== undefined)
    backend.syncRetryInterval = frontend.retryInterval;
  if (frontend.fullSyncInterval !== undefined)
    backend.syncFullSyncInterval = frontend.fullSyncInterval;
  if (frontend.syncMinute !== undefined)
    backend.syncMinute = frontend.syncMinute;
  if (frontend.daysOfWeek !== undefined)
    backend.syncDaysOfWeek = frontend.daysOfWeek;
  if (frontend.daysOfMonth !== undefined)
    backend.syncDaysOfMonth = frontend.daysOfMonth;
  return backend;
}

// Fetch LDAP settings
export async function fetchBasicInfo(): Promise<BasicInfo[]> {
  const data = await fetchWithAuth(getBackendUrl(LDAP_ENDPOINTS.config));
  // Transform sync settings fields from backend to frontend format
  return data.map((item: any) => ({
    ...item,
    // Include sync settings in the response for compatibility
    ...transformBackendToFrontendSyncSettings(item),
  }));
}

// Test ldap connection (expects payload: BasicInfo or Partial<BasicInfo>)
export async function testLdapConnection(
  payload: Partial<BasicInfo>
): Promise<boolean> {
  // If config ID exists, use the test endpoint with ID
  // Otherwise, we need to create the config first, then test
  const configId = payload.id;

  if (!configId) {
    throw new Error(
      "Cannot test connection: Configuration must be saved first. Please save your settings before testing."
    );
  }

  // Test existing config using its ID
  // Replace :id placeholder with actual config ID
  const endpoint = LDAP_ENDPOINTS.testConnection.replace(":id", configId);
  return await fetchWithAuth(getBackendUrl(endpoint), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
}

// Save LDAP settings (create or update)
export async function saveLdapSettings(
  payload: Partial<BasicInfo>
): Promise<BasicInfo> {
  const configId = payload.id;

  // Extract sync settings fields and transform them
  const syncFields: Partial<SyncSettings> = {
    enabled: (payload as any).enabled,
    frequency: (payload as any).frequency,
    syncTime: (payload as any).syncTime,
    timezone: (payload as any).timezone,
    retryAttempts: (payload as any).retryAttempts,
    retryInterval: (payload as any).retryInterval,
    fullSyncInterval: (payload as any).fullSyncInterval,
    syncMinute: (payload as any).syncMinute,
    daysOfWeek: (payload as any).daysOfWeek,
    daysOfMonth: (payload as any).daysOfMonth,
  };

  // Remove sync settings from payload (they'll be added in backend format)
  const {
    enabled,
    frequency,
    syncTime,
    timezone,
    retryAttempts,
    retryInterval,
    fullSyncInterval,
    syncMinute,
    daysOfWeek,
    daysOfMonth,
    ...basicInfoPayload
  } = payload as any;

  // Transform sync settings to backend format
  const backendSyncSettings =
    transformFrontendToBackendSyncSettings(syncFields);

  // Merge basic info with transformed sync settings
  const backendPayload = {
    ...basicInfoPayload,
    ...backendSyncSettings,
  };

  if (configId) {
    // Update existing config
    // Remove id from payload as it's already in the URL path
    const { id, ...updatePayload } = backendPayload;
    const endpoint = LDAP_ENDPOINTS.byId.replace(":id", configId);
    const response = await fetchWithAuth(getBackendUrl(endpoint), {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload),
    });
    // Transform response back to frontend format
    return {
      ...response,
      ...transformBackendToFrontendSyncSettings(response),
    };
  } else {
    // Create new config
    const response = await fetchWithAuth(getBackendUrl(LDAP_ENDPOINTS.config), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload),
    });
    // Transform response back to frontend format
    return {
      ...response,
      ...transformBackendToFrontendSyncSettings(response),
    };
  }
}

// Fetch sample LDAP users
export async function showSample(configId?: string): Promise<any> {
  const url = new URL(getBackendUrl(LDAP_ENDPOINTS.sample));
  if (configId) {
    url.searchParams.append("configId", configId);
  }
  return await fetchWithAuth(url.toString(), {
    method: "GET",
    credentials: "include",
  });
}

// // Sync LDAP users (expects response: AD-Entry[])
// export async function syncLdapUsers(): Promise<any> {
//   return await fetchWithAuth(getBackendUrl(LDAP_ENDPOINTS.syncStart), {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ isManualSync: true }),
//   });
// }

// // Cancel ongoing LDAP sync operation
// export async function cancelLdapSync(): Promise<any> {
//   return await fetchWithAuth(getBackendUrl(LDAP_ENDPOINTS.syncCancel), {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//   });
// }
