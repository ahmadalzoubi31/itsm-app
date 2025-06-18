import { User } from "../../users/data/types";
import { PermissionName } from "./enums";

export interface Permission {
  id: string;
  name: PermissionName;
  user: User;
}
