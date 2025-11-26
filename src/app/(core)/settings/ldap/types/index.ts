import { ProtocolEnum } from "../constants/protocol.constant";
import { SearchScopeEnum } from "../constants/search-scope.constant";
import { SyncStatusEnum } from "../constants/sync-status.constant";
import { FrequencyEnum } from "../constants/frequency.constant";
import { BaseEntity } from "@/lib/types/globals";
import { StagedUserStatusEnum } from "../constants/staged-user-status.constant";

export type BasicInfo = {
  id?: string;
  name: string;
  server: string;
  port: number;
  protocol: ProtocolEnum;
  baseDN: string;
  bindDN: string;
  bindPassword: string;
  userSearchBase: string;
  userSearchFilter: string;
  userSearchScope: SearchScopeEnum;
  attributes: Record<string, string>;
  isEnabled: boolean;
  secureConnection: boolean;
  allowSelfSignedCert: boolean;
  groupMappings: Record<string, string[]>;
  roleMappings: Record<string, string[]>;
  deactivateRemovedUsers: boolean;
  connectionTimeout: number;
  pageSizeLimit: number;
  stagingMode?: "full" | "new-only" | "disabled";
};

export type SyncSettings = {
  id?: string;
  enabled: boolean;
  frequency: FrequencyEnum;
  syncTime?: string; // Optional - required for DAILY, WEEKLY, MONTHLY but not HOURLY
  timezone: string;
  retryAttempts: number;
  retryInterval: number;
  fullSyncInterval: number;
  syncMinute?: number; // For HOURLY (0-59)
  daysOfWeek?: number[]; // For WEEKLY (0-6, Sunday = 0) - multiple days allowed
  daysOfMonth?: number[]; // For MONTHLY (1-31) - multiple days allowed
};

export type SyncHistory = {
  id: string;
  timestamp: Date;
  status: SyncStatusEnum;
  details: string;
  usersFetched?: number;
  duration?: number;
  // Backend fields
  syncStartTime?: Date;
  syncEndTime?: Date;
  usersProcessed?: number;
  usersAdded?: number;
  usersUpdated?: number;
  usersDeactivated?: number;
  usersSkipped?: number;
  errors?: number;
  durationMs?: number;
  errorDetails?: string;
  trigger?: "manual" | "scheduled" | "automatic";
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
