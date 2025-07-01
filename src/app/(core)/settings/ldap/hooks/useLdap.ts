import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLdapSettings,
  saveLdapSettings,
} from "../../services/settings.service";
import { testLdapConnection } from "../services/ldap.service";

// Get LDAP settings
export function useGetLdapSettings() {
  return useQuery({
    queryKey: ["ldapSettings"],
    queryFn: fetchLdapSettings,
    select: (data) => data.data,
    refetchOnWindowFocus: false,
  });
}

// Save LDAP settings
export function useSaveLdapSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveLdapSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ldapSettings"] });
    },
  });
}

// Test LDAP settings
export function useTestLdapSettings() {
  return useMutation({ mutationFn: testLdapConnection });
}
