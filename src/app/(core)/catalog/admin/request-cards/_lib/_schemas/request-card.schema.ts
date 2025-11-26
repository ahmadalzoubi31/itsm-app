import { z } from "zod";

export const requestCardSchema = z.object({
  serviceId: z
    .string()
    .min(1, "Please select a service")
    .uuid("Please select a valid service"),
  key: z
    .string()
    .min(1, "Key is required")
    .min(2, "Key must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Key must be lowercase alphanumeric with hyphens"),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  jsonSchema: z
    .any()
    .refine(
      (val) => val && typeof val === "object" && val.type === "object",
      "JSON Schema is required and must be a valid object"
    ),
  uiSchema: z.any().optional(),
  defaults: z.record(z.any()).optional(),
  defaultAssignmentGroupId: z
    .string()
    .min(1, "Please select an assignment group")
    .uuid("Please select a valid assignment group"),

  workflowId: z.string().optional(),
  // .union([z.string().uuid("Please select a valid workflow"), z.literal("")])
  active: z.boolean({
    required_error: "Active status is required",
    invalid_type_error: "Active must be a boolean value",
  }),
  approvalGroupId: z.union([z.string().uuid(), z.literal("")]).optional(),
  approvalConfig: z
    .object({
      userId: z.string().uuid().optional(),
      groupId: z.string().uuid().optional(),
      requireAll: z.boolean().optional(),
    })
    .optional(), // Deprecated - use approvalSteps
  approvalSteps: z
    .array(
      z.object({
        order: z.number().int().positive(),
        type: z.enum(["manager", "direct", "group"]),
        config: z
          .object({
            userId: z.string().uuid().optional(),
            groupId: z.string().uuid().optional(),
            requireAll: z.boolean().optional(),
          })
          .optional(),
      })
    )
    .optional(),
});

export type RequestCardFormValues = z.infer<typeof requestCardSchema>;
