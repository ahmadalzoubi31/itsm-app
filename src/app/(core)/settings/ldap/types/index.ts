export type LdapSettings = {
  server: string;
  port: number;
  protocol: "ldap" | "ldaps";
  baseDn: string;
  bindDn: string;
  bindPassword: string;
  searchFilter: string;
  attributes: string;
  useSSL: boolean;
  validateCert: boolean;
};
