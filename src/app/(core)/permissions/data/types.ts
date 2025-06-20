import { User } from "../../users/types/types";
import { PermissionName } from "./enums";

export interface Permission {
  id: string;
  name: PermissionName;
  user: User;
}
