import { z } from "zod";

export const subcategorySchema = z.object({
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

  categoryId: z.string().uuid("Please select a category"),

  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  // Backend: CreateCaseSubcategoryDto doesn't have `active`,
  // UpdateCaseSubcategoryDto has `active?: boolean`.
  // Entity has `active: boolean` with default true.
  active: z.boolean().optional(),
});

export type SubcategoryFormValues = z.infer<typeof subcategorySchema>;
