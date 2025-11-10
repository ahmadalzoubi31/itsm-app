export interface CreateGroupDto {
  type: "help-desk" | "tier-1" | "tier-2" | "tier-3";
  name: string;
  description?: string;
  businessLineId: string;
}

export interface UpdateGroupDto extends Partial<CreateGroupDto> {}
