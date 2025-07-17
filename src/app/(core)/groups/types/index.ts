import { BaseEntity } from "@/types/globals";
import { GroupTypeEnum } from "../constants/group-type.constant";
import { GroupStatusEnum } from "../constants/group-status.constant";
import { User } from "@/app/(core)/users/types";

export type Group = BaseEntity & {
  name: string;
  description?: string;
  type: GroupTypeEnum;
  status: GroupStatusEnum;
  members: GroupMember[];
  leaderId?: string;
  leader?: User;
  email?: string;
  phone?: string;
  location?: string;
  isActive: boolean;
  tags?: string[];
};

export type GroupMember = {
  id: string;
  userId: string;
  groupId: string;
  role: GroupMemberRoleEnum;
  joinedAt: Date;
  isActive: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone?: string;
  };
};

export enum GroupMemberRoleEnum {
  MEMBER = "MEMBER",
  LEADER = "LEADER",
  ADMIN = "ADMIN",
}

export const GROUP_MEMBER_ROLES = [
  { value: GroupMemberRoleEnum.MEMBER, label: "Member" },
  { value: GroupMemberRoleEnum.LEADER, label: "Leader" },
  { value: GroupMemberRoleEnum.ADMIN, label: "Admin" },
] as const;

export type CreateGroupDto = {
  name: string;
  description?: string;
  type: GroupTypeEnum;
  status: GroupStatusEnum;
  leaderId?: string;
  email?: string;
  phone?: string;
  location?: string;
  tags?: string[];
  memberIds?: string[];
};

export type UpdateGroupDto = Partial<CreateGroupDto>;

export type GroupFilters = {
  search?: string;
  type?: GroupTypeEnum;
  status?: GroupStatusEnum;
  isActive?: boolean;
  leaderId?: string;
};
