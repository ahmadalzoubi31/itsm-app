import { z } from "zod";

export const permissionSchema = z.object({
  id: z.string().min(1, "ID is required"),
  key: z.string().min(1, "Key is required"), // e.g., "case:read:own"
  subject: z.string().min(1, "Subject is required"), // e.g., "Case" or "all"
  action: z.string().min(1, "Action is required"), // e.g., "read", "update", "manage"
  conditions: z.record(z.any()).optional().nullable(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});
