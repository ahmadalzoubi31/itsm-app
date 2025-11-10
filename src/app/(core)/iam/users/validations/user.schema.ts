import { object, z } from "zod";
import { permissionSchema } from "../../permissions/validations/permission.schema";
import { AuthSource } from "../interfaces/user.interface";
import { roleSchema } from "../../roles/validations/role.schema";
// Password validation: at least 8 characters with uppercase, lowercase, and number/special character
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;

export const userSchema = object({
  id: z.string().optional(),
  username: z
    .string()
    .min(1, "Username is required")
    .max(80, "Username must be at most 80 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(150, "Email must be at most 150 characters")
    .optional()
    .or(z.literal("")),
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(150, "Display name must be at most 150 characters"),
  authSource: z.enum([AuthSource.LOCAL, AuthSource.LDAP], {
    required_error: "Authentication source is required",
  }),
  externalId: z.string().optional(),
  password: z.string().optional(),
  isActive: z.boolean(),
  isLicensed: z.boolean(),
  permissions: z.array(permissionSchema).default([]).optional(),
  roles: z.array(roleSchema).default([]).optional(),
}).superRefine((data, ctx) => {
  // Password validation when authSource is local
  if (data.authSource === "local") {
    if (data.id && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required for local authentication",
        path: ["password"],
      });
    } else if (data.password && !passwordRegex.test(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Password must be at least 8 characters long and contain uppercase letters, lowercase letters, and at least one number or special character",
        path: ["password"],
      });
    }
  }
});

export type UserFormValues = z.infer<typeof userSchema>;
