import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { saveLdapSettings } from "../../services/settings.service";
import { fetchBasicInfo, testLdapConnection } from "../services/ldap.service";

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
    },
  });
}

// Test LDAP settings
export function useTestBasicInfo() {
  return useMutation({ mutationFn: testLdapConnection });
}
