import { BasicInfo, SyncSettings } from "../types";
import { ProtocolEnum } from "./protocol.constant";
import { SearchScopeEnum } from "./search-scope.constant";
import { FrequencyEnum } from "./frequency.constant";

export const DEFAULT_LDAP_SETTINGS: Partial<BasicInfo> = {
  server: "",
  port: 389,
  protocol: ProtocolEnum.LDAP,
  baseDN: "",
  bindDN: "",
  bindPassword: "",
  userSearchBase: "",
  userSearchFilter: "(objectClass=user)",
  userSearchScope: SearchScopeEnum.SUB,
  attributes: {},
  isEnabled: false,
  secureConnection: false,
  allowSelfSignedCert: true,
  groupMappings: {},
  roleMappings: {},
  deactivateRemovedUsers: false,
  connectionTimeout: 5000,
  pageSizeLimit: 1000,
};

export const DEFAULT_SYNC_SETTINGS: Partial<SyncSettings> = {
  enabled: false,
  frequency: FrequencyEnum.DAILY,
  syncTime: "02:00",
  timezone: "UTC",
  retryAttempts: 3,
  retryInterval: 30,
  fullSyncInterval: 7,
  syncMinute: 0,
  daysOfWeek: [0], // Sunday by default
  daysOfMonth: [1], // 1st day of month by default
};
