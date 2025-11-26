import { BaseEntity } from "@/lib/types/globals";

export interface Permission extends BaseEntity {
  id: string;
  key: string; // e.g., "case:read:own"
  subject: string; // e.g., "Case" or "all"
  action: string; // e.g., "read", "update", "manage"
  conditions?: Record<string, any>;
  category: string;
  description?: string;
}
