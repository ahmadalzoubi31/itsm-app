// app/(core)/iam/roles/_lib/_types/role.type.ts

import type { BaseEntity } from "@/lib/types/globals";
import type { Permission } from "../../../permissions/interfaces/permission.interface";

export type Role = BaseEntity & {
  id: string;
  key: string; // e.g., admin, agent, requester
  name: string;
  description?: string;
  permissionCount: number;
  userCount: number;
  permissions: Permission[];
};

export type RolePermission = BaseEntity & {
  roleId: string;
  permissionId: string;
  role: Role;
  permission: Permission;
};
