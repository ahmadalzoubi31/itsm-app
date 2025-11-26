import { z } from "zod";
import { permissionSchema } from "../../../permissions/validations/permission.schema";
import { roleSchema } from "../../../roles/_lib/_schemas/role.schema";
import { AUTH_SOURCE, type AuthSource } from "../_types";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;

export const userSchema = z
  .object({
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
      .nullable(),

    displayName: z
      .string()
      .min(1, "Display name is required")
      .max(150, "Display name must be at most 150 characters"),

    authSource: z
      .enum([AUTH_SOURCE.LOCAL, AUTH_SOURCE.LDAP] as [AuthSource, AuthSource])
      .optional(),

    externalId: z.string().optional(),

    password: z.string().optional(),

    isActive: z.boolean(),
    isLicensed: z.boolean(),

    permissions: z.array(permissionSchema).default([]),
    roles: z
      .array(
        roleSchema.extend({
          permissions: z.array(permissionSchema).optional().default([]),
        })
      )
      .default([]),
  })
  .superRefine((data, ctx) => {
    const isNewUser = !data.id;
    const isLocal =
      data.authSource === AUTH_SOURCE.LOCAL || (!data.authSource && isNewUser);

    // Local users MUST provide valid password
    if (isLocal) {
      // Password is required ONLY for new users
      if (isNewUser && !data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required for local accounts",
          path: ["password"],
        });
        return;
      }

      // If password is provided (new or update), it must meet complexity requirements
      if (data.password && !passwordRegex.test(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Password must be at least 8 characters long and contain uppercase, lowercase, and a number/special character",
          path: ["password"],
        });
      }
    }
  });

export type UserSchema = z.infer<typeof userSchema>;
