import { z, object } from "zod";
import { PermissionCategoryEnum } from "../constants/permission-category.constant";
import { PermissionNameEnum } from "../constants/permission-name.constant";

export const permissionSchema = object({
  name: z.nativeEnum(PermissionNameEnum),
  category: z.nativeEnum(PermissionCategoryEnum),
  description: z.string(),
});
