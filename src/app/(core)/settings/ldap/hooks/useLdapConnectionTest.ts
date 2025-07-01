import { useMutation } from "@tanstack/react-query";
import { testLdapConnection } from "../services/ldap.service";
import { LdapSettings } from "../types";

export function useLdapConnectionTest() {
  return useMutation({
    mutationFn: (settings: Partial<LdapSettings>) =>
      testLdapConnection(settings),
  });
}
