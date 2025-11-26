import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBasicInfo,
  testLdapConnection,
  saveLdapSettings,
} from "../services/ldap.service";

// Get LDAP settings
export function useGetBasicInfo() {
  return useQuery({
    queryKey: ["basicInfo"],
    queryFn: fetchBasicInfo,
    select: (data) => data,
    refetchOnWindowFocus: false,
  });
}

// Save LDAP settings
export function useSaveBasicInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveLdapSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["basicInfo"] });
      queryClient.invalidateQueries({ queryKey: ["syncSettings"] });
    },
  });
}

// Test LDAP settings
export function useTestBasicInfo() {
  return useMutation({ mutationFn: testLdapConnection });
}
