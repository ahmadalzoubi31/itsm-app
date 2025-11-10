import { z } from "zod";

export const groupSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["help-desk", "tier-1", "tier-2", "tier-3"]),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  businessLineId: z.string().min(1, "Business line is required"),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
