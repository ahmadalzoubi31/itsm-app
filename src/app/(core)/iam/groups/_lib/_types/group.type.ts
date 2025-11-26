import type { BaseEntity, BusinessLine } from "@/lib/types/globals";

export type GroupMembership = {
  groupId: string;
  userId: string;
  createdAt: string;
};

export type GroupType = "help-desk" | "tier-1" | "tier-2" | "tier-3";

export type Group = BaseEntity & {
  id: string;
  type: GroupType;
  name: string;
  description?: string;
  businessLine: BusinessLine;
  memberships?: GroupMembership[];
};

// DTO used by forms + server actions
export type UpsertGroupDto = {
  id?: string;
  type: GroupType;
  name: string;
  description?: string;
  businessLineId: string;
};
