// src/app/(core)/iam/groups/_types/group-dto.type.ts

export type CreateGroupDto = {
  type: "help-desk" | "tier-1" | "tier-2" | "tier-3";
  name: string;
  description?: string;
  businessLineId: string;
};

export type UpdateGroupDto = Partial<CreateGroupDto>;
