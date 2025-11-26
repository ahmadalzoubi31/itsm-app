import { z } from "zod";
import { permissionSchema } from "../../../permissions/validations/permission.schema";

export const roleSchema = z.object({
  id: z.string().optional(),
  key: z
    .string()
    .min(1, "Key is required")
    .max(50, "Key must be at most 50 characters")
    .regex(
      /^[a-z0-9-_]+$/,
      "Key must contain only lowercase letters, numbers, hyphens, and underscores"
    ),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  permissions: z.array(permissionSchema),
});

export type RoleSchema = z.infer<typeof roleSchema>;
