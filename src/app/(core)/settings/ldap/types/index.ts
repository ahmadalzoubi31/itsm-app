import { ProtocolEnum } from "../constants/protocol.constant";
import { SearchScopeEnum } from "../constants/search-scope.constant";
import { SyncStatusEnum } from "../constants/sync-status.constant";
import { FrequencyEnum } from "../constants/frequency.constant";
import { BaseEntity } from "@/types/globals";
import { StagedUserStatusEnum } from "../constants/staged-user-status.constant";

export type LdapSettings = {
  server: string;
  port: number;
  protocol: ProtocolEnum;
  searchBase: string;
  bindDn: string;
  bindPassword: string;
  searchScope: SearchScopeEnum;
  searchFilter: string;
  attributes: string;
  useSSL: boolean;
  validateCert: boolean;
};

export type SyncSettings = {
  enabled: boolean;
  frequency: FrequencyEnum;
  syncTime: string;
  timezone: string;
  retryAttempts: number;
  retryInterval: number;
  fullSyncInterval: number;
};

export type SyncHistory = {
  id: string;
  timestamp: Date;
  status: SyncStatusEnum;
  details: string;
  usersFetched?: number;
  duration?: number;
};

export type StagedUser = BaseEntity & {
  cn?: string;
  mail?: string;
  sAMAccountName?: string;
  displayName?: string;
  department?: string;
  givenName?: string;
  sn?: string;
  title?: string;
  mobile?: string;
  userPrincipalName?: string;
  objectGUID: string;
  manager?: string;
  additionalAttributes?: Record<string, any>;
  status: StagedUserStatusEnum;
  selected: boolean;
};
