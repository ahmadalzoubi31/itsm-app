import { z } from "zod";
import { GroupTypeEnum } from "../constants/group-type.constant";
import { GroupStatusEnum } from "../constants/group-status.constant";

export const groupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100, "Group name must be less than 100 characters"),
  description: z.string().optional(),
  type: z.nativeEnum(GroupTypeEnum, {
    errorMap: () => ({ message: "Please select a valid group type" })
  }),
  status: z.nativeEnum(GroupStatusEnum, {
    errorMap: () => ({ message: "Please select a valid group status" })
  }),
  leaderId: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
  memberIds: z.array(z.string()).optional(),
});

export const createGroupSchema = groupSchema.omit({ status: true }).extend({
  status: z.nativeEnum(GroupStatusEnum).default(GroupStatusEnum.ACTIVE),
});

export const updateGroupSchema = groupSchema.partial();

export const groupMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  groupId: z.string().min(1, "Group ID is required"),
  role: z.enum(["MEMBER", "LEADER", "ADMIN"]).default("MEMBER"),
});

export const addMemberSchema = z.object({
  userIds: z.array(z.string()).min(1, "At least one user must be selected"),
  role: z.enum(["MEMBER", "LEADER", "ADMIN"]).default("MEMBER"),
});

export const groupFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(GroupTypeEnum).optional(),
  status: z.nativeEnum(GroupStatusEnum).optional(),
  isActive: z.boolean().optional(),
  leaderId: z.string().optional(),
});

export type GroupFormData = z.infer<typeof groupSchema>;
export type CreateGroupFormData = z.infer<typeof createGroupSchema>;
export type UpdateGroupFormData = z.infer<typeof updateGroupSchema>;
export type GroupMemberFormData = z.infer<typeof groupMemberSchema>;
export type AddMemberFormData = z.infer<typeof addMemberSchema>;
export type GroupFiltersFormData = z.infer<typeof groupFiltersSchema>; 