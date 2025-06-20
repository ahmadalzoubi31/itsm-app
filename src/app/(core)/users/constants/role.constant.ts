import { Role } from "../enums/role.enum";

export const roles = [
  { value: Role.ADMIN, label: "Admin" },
  { value: Role.AGENT, label: "Agent" },
  { value: Role.USER, label: "User" },
] as const;
