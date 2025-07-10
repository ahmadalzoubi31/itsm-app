import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { syncLdapUsers, cancelLdapSync } from "../services/ldap.service";

import {
  fetchSyncSettings,
  saveSyncSettings,
} from "../../services/settings.service";
import { getSyncHistory } from "../services/sync.service";

// Get Sync settings
export function useGetSyncSettings() {
  return useQuery({
    queryKey: ["syncSettings"],
    queryFn: fetchSyncSettings,
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
}

// Save Sync settings
export function useSaveSyncSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSyncSettings,
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

// Get Sync history
export function useGetSyncHistory() {
  return useQuery({
    queryKey: ["syncHistory"],
    queryFn: getSyncHistory,
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
}
