// src/app/(core)/catalog/admin/services/_lib/_schemas/service.schema.ts

import { z } from "zod";

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  key: z
    .string()
    .min(2, "Key must be at least 2 characters")
    .max(100, "Key must be at most 100 characters")
    .regex(/^[a-z0-9-]+$/, "Key must be lowercase alphanumeric with hyphens"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must be at most 150 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
  businessLineId: z.string().uuid("Please select a business line"),
  categoryId: z.string().uuid("Please select a category"),
  subcategoryId: z.string().uuid("Please select a subcategory"),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
