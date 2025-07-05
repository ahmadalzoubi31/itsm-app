import { LdapSettings, SyncSettings } from "../types";
import { ProtocolEnum } from "./protocol.constant";
import { SearchScopeEnum } from "./search-scope.constant";
import { FrequencyEnum } from "./frequency.constant";

export const DEFAULT_LDAP_SETTINGS: LdapSettings = {
  server: "",
  port: 389,
  protocol: ProtocolEnum.LDAP,
  searchBase: "",
  bindDn: "",
  bindPassword: "",
  searchScope: SearchScopeEnum.SUB,
  searchFilter: "(objectClass=user)",
  attributes:
    "cn,mail,displayName,givenName,sn,userPrincipalName,department,title,mobile,sAMAccountName,distinguishedName",
  useSSL: false,
  validateCert: true,
};

export const DEFAULT_SYNC_SETTINGS: SyncSettings = {
  enabled: false,
  frequency: FrequencyEnum.DAILY,
  syncTime: "02:00",
  timezone: "UTC",
  retryAttempts: 3,
  retryInterval: 30,
  fullSyncInterval: 7,
};
