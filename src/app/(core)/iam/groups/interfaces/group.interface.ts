import { BaseEntity, BusinessLine } from "@/types/globals";

export interface Group extends BaseEntity {
  id: string;
  type: "help-desk" | "tier-1" | "tier-2" | "tier-3";
  name: string;
  description?: string;
  businessLine: BusinessLine;
}
