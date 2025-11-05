import { BaseEntity } from "@/types/globals";
import { Permission } from "../../permissions/interfaces/permission.interface";
import { Role } from "../../roles/interfaces/role.interface";

export enum AuthSource {
  LOCAL = "local",
  LDAP = "ldap",
}

export interface User extends BaseEntity {
  id: string;
  username: string;
  email?: string;
  displayName: string;
  authSource: AuthSource; // 'local' | 'ldap'
  externalId?: string; // AD GUID
  passwordHash?: string; // only for 'local' users
  isActive: boolean;
  lastLoginAt?: Date;
  // TODO: Add memberships
  // memberships: Membership[];
  userRoles: Role[];
  userPermissions: Permission[];
}

export interface UserRole extends BaseEntity {
  id: string;
  userId: string;
  roleId: string;
  user: User;
  role: Role;
}

export interface UserPermission extends BaseEntity {
  id: string;
  userId: string;
  permissionId: string;
  user: User;
  permission: Permission;
  metadata?: Record<string, any>;
}
