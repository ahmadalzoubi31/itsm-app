import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSyncHistory,
  getSyncStatus,
  saveBasicInfo,
  syncLdapUsers,
  cancelLdapSync,
} from "../services/sync.service";
import { fetchBasicInfo } from "../services/ldap.service";
import { BasicInfo, SyncSettings } from "../types";

// Get Sync settings
export function useGetSyncSettings() {
  return useQuery({
    queryKey: ["syncSettings"],
    queryFn: fetchBasicInfo,
    refetchOnWindowFocus: false,
  });
}

// Helper function to filter out metadata fields that shouldn't be sent to the API
function filterMetadataFields<T extends Record<string, any>>(
  data: T
): Partial<T> {
  const metadataFields = [
    "createdAt",
    "createdById",
    "createdByName",
    "updatedAt",
    "updatedById",
    "updatedByName",
    "lastSyncAt",
    "nextSyncAt",
  ];

  const filtered = { ...data };
  metadataFields.forEach((field) => {
    delete filtered[field];
  });

  return filtered;
}

// Save Sync settings
export function useSaveSyncSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (syncSettings: Partial<SyncSettings>) => {
      // Get current BasicInfo to merge with sync settings
      const currentSettings = queryClient.getQueryData<SyncSettings[]>([
        "syncSettings",
      ]);
      const currentSyncSettings = currentSettings?.[0];

      if (!currentSyncSettings) {
        throw new Error(
          "LDAP configuration not found. Please configure basic LDAP settings first."
        );
      }

      // Merge current BasicInfo with sync settings
      // This ensures all fields are preserved, not just sync fields
      const updatedSyncSettings: Partial<SyncSettings> = {
        ...currentSyncSettings,
        ...syncSettings,
        // Ensure id is preserved
        id: currentSyncSettings.id,
      };

      // Filter out metadata fields before sending to API
      const filteredSettings = filterMetadataFields(updatedSyncSettings);

      return saveBasicInfo(filteredSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syncSettings"] });
    },
  });
}

// Sync LDAP users
export function useSyncLdapUsers() {
  return useMutation({ mutationFn: syncLdapUsers });
}

// Cancel LDAP sync operation
export function useCancelLdapSync() {
  return useMutation({ mutationFn: cancelLdapSync });
}

// Get Sync history with auto-refresh
export function useGetSyncHistory(configId?: string) {
  return useQuery({
    queryKey: ["syncHistory", configId],
    queryFn: () => {
      if (!configId) {
        throw new Error("Configuration ID is required");
      }
      return getSyncHistory(configId);
    },
    enabled: !!configId,
    refetchOnWindowFocus: true,
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });
}

// Get sync status with polling
export function useGetSyncStatus(syncId?: string, enabled: boolean = false) {
  return useQuery({
    queryKey: ["syncStatus", syncId],
    queryFn: () => {
      if (!syncId) {
        throw new Error("Sync ID is required");
      }
      return getSyncStatus(syncId);
    },
    enabled: enabled && !!syncId,
    refetchInterval: enabled && syncId ? 5000 : false, // Poll every 5 seconds when enabled
    refetchOnWindowFocus: true,
  });
}
