import { User } from "../../users/types";
import { PermissionCategoryEnum } from "../constants/permission-category.constant";
import { PermissionNameEnum } from "../constants/permission-name.constant";

export type Permission = {
  id: string;
  name: PermissionNameEnum;
  category: PermissionCategoryEnum;
  description: string;
  users: User[];
};

export type AssignPermissionDto = {
  userId: string;
  permissionId: string;
};

export type RemovePermissionDto = {
  userId: string;
  permissionId: string;
};
