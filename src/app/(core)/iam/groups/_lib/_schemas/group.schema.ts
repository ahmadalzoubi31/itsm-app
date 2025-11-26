// src/app/(core)/iam/groups/schemas/group.schema.ts

import { z } from "zod";

export const GROUP_TYPES = [
  "help-desk",
  "tier-1",
  "tier-2",
  "tier-3",
] as const;

export const groupSchema = z.object({
  id: z.string().optional(),

  type: z.enum(GROUP_TYPES, {
    required_error: "Group type is required",
  }),

  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  businessLineId: z
    .string()
    .min(1, "Business line is required"),
});

export type GroupSchema = z.infer<typeof groupSchema>;
