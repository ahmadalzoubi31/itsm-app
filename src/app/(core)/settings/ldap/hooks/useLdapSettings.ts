import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLdapSettings,
  saveLdapSettings,
} from "../../services/settings.service";
import { LdapSettings } from "../types";

// Fetch LDAP settings
export function useLdapSettings() {
  return useQuery({
    queryKey: ["ldapSettings"],
    queryFn: fetchLdapSettings,
    select: (res) => res.data?.jsonValue as LdapSettings | undefined, // You may have { id, type, jsonValue }
  });
}

// Update/save LDAP settings
export function useSaveLdapSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveLdapSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ldapSettings"] });
    },
  });
}
