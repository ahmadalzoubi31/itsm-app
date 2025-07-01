import { useQuery } from "@tanstack/react-query";
import { showSample } from "../services/ldap.service";

export function useLdapSampleUsers(enabled = false) {
  return useQuery({
    queryKey: ["ldapSampleUsers"],
    queryFn: showSample,
    enabled, // Set to false unless you want it to run on mount
  });
}
