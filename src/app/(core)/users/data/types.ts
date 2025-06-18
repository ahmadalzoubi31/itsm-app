import { Permission } from "../../permissions/data/types";
import { Role } from "./enums";
import { BaseEntity, Status } from "@/types/globals";

export interface User extends BaseEntity {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  password?: string;
  role: Role;
  phone?: string;
  address?: string;
  permissions: Permission[];
  status: string;
}

export interface AddUserInput {
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  status: string;
}

export interface EditUserInput {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  status?: string;
}
