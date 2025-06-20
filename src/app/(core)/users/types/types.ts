import { Permission } from "../../permissions/data/types";
import { Role } from "../enums/role.enum";
import { Status } from "../enums/status.enum";
import { BaseEntity } from "@/types/globals";

export type User = BaseEntity & {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  phone?: string;
  address?: string;
  permissions: Permission[];
  status: string;
};

export type AddUserInput = {
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  status: string;
};

export type EditUserInput = Partial<AddUserInput> & {
  id: string;
};
