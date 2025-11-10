import { BaseEntity } from "@/types/globals";
import { Permission } from "../../permissions/interfaces/permission.interface";

export interface Role extends BaseEntity {
  id: string;
  key: string; // e.g., "admin", "agent", "requester"
  name: string;
  description?: string;
  permissionCount: number;
  userCount: number;
  permissions: Permission[];
}

export interface RolePermission extends BaseEntity {
  roleId: string;
  permissionId: string;
  role: Role;
  permission: Permission;
}
