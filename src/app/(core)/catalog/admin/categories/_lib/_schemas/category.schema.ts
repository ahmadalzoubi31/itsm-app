import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().uuid().optional(),

  key: z
    .string()
    .min(2, "Key must be at least 2 characters")
    .max(50, "Key must be at most 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Key must be lowercase letters, numbers and hyphens only"
    ),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  // Backend: CreateCaseCategoryDto doesn't have `active`,
  // UpdateCaseCategoryDto has `active?: boolean`.
  // Entity has `active: boolean` with default true.
  active: z.boolean().optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
