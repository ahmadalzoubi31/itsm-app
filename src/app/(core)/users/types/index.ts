import { Permission } from "../../permissions/types";
import { BaseEntity } from "@/types/globals";
import { RoleEnum } from "../constants/role.constant";
import { StatusEnum } from "../constants/status.constant";

export type User = BaseEntity & {
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  password?: string;
  role: RoleEnum;
  phone?: string;
  address?: string;
  permissions: Permission[];
  objectGUID?: string;
  status: StatusEnum;
};

export type LoggedUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  permissions: string[];
};
