export interface LdapSettings {
  server: string;
  port: number;
  protocol: "ldap" | "ldaps";
  baseDn: string;
  bindDn?: string;
  bindPassword?: string;
  searchFilter: string;
  attributes: string;
  useSSL: boolean;
  validateCert: boolean;
}

export const DEFAULT_LDAP_SETTINGS: LdapSettings = {
  server: "",
  port: 389,
  protocol: "ldap",
  baseDn: "",
  searchFilter: "(objectClass=user)",
  attributes:
    "cn,mail,displayName,givenName,sn,userPrincipalName,department,title,telephoneNumber",
  useSSL: false,
  validateCert: true,
};

export type ConnectionStatus = "connected" | "disconnected" | "testing";

export interface LdapSettingsFormProps {
  settings: LdapSettings;
  onSubmit: (values: LdapSettings) => void;
  isSubmitting?: boolean;
}
