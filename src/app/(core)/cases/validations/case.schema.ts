import { z } from "zod";
import { CasePriority, CaseStatus } from "../types";

/**
 * Validation schema for creating a case
 */
export const createCaseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: z.string().optional(),
  priority: z.nativeEnum(CasePriority, {
    errorMap: () => ({ message: "Invalid priority" }),
  }),
  requesterId: z.string().uuid("Invalid requester ID"),
  assigneeId: z.string().uuid("Invalid assignee ID").optional(),
  assignmentGroupId: z.string().uuid("Invalid assignment group ID"),
  businessLineId: z.string().uuid("Invalid business line ID"),
  categoryId: z.string().uuid("Invalid category ID"),
  subcategoryId: z.string().uuid("Invalid subcategory ID"),
  affectedServiceId: z.string().uuid("Invalid affected service ID").optional(),
  requestCardId: z.string().uuid("Invalid request card ID").optional(),
});

/**
 * Validation schema for updating a case
 */
export const updateCaseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  description: z.string().optional(),
  status: z
    .nativeEnum(CaseStatus, {
      errorMap: () => ({ message: "Invalid status" }),
    })
    .optional(),
  priority: z
    .nativeEnum(CasePriority, {
      errorMap: () => ({ message: "Invalid priority" }),
    })
    .optional(),
  assigneeId: z.string().uuid("Invalid assignee ID").optional(),
  assignmentGroupId: z.string().uuid("Invalid assignment group ID").optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  subcategoryId: z.string().uuid("Invalid subcategory ID").optional(),
});

/**
 * Validation schema for assigning a case
 */
export const assignCaseSchema = z.object({
  assigneeId: z.string().uuid("Invalid assignee ID").optional(),
  assignmentGroupId: z.string().uuid("Invalid assignment group ID").optional(),
});

/**
 * Validation schema for changing case status
 */
export const changeStatusSchema = z.object({
  status: z.nativeEnum(CaseStatus, {
    errorMap: () => ({ message: "Invalid status" }),
  }),
});

/**
 * Validation schema for adding a comment
 */
export const createCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty"),
  isPrivate: z.boolean().optional(),
});

export type CreateCaseFormData = z.infer<typeof createCaseSchema>;
export type UpdateCaseFormData = z.infer<typeof updateCaseSchema>;
export type AssignCaseFormData = z.infer<typeof assignCaseSchema>;
export type ChangeStatusFormData = z.infer<typeof changeStatusSchema>;
export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
