import type { BaseEntity } from "@/lib/types/globals";
import type { Permission } from "../../../permissions/interfaces/permission.interface";
import type { Role } from "@/app/(core)/iam/roles/_lib/_types/role.type";

export const AUTH_SOURCE = {
  LOCAL: "local",
  LDAP: "ldap",
} as const;

export type AuthSource = (typeof AUTH_SOURCE)[keyof typeof AUTH_SOURCE];

export type User = BaseEntity & {
  id: string;
  username: string;
  email?: string;
  displayName: string;
  authSource: AuthSource;
  externalId?: string;
  password?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  isLicensed: boolean;

  metadata?: Record<string, any> & {
    firstName?: string;
    lastName?: string;
    phone?: string;
    mobile?: string;
    department?: string;
    title?: string;
    company?: string;
    manager?: string;
    employeeId?: string;
    employeeType?: string;
    location?: string;
    city?: string;
    state?: string;
    country?: string;
    description?: string;
    userPrincipalName?: string;
  };

  roles: Role[];
  permissions: Permission[];
};
