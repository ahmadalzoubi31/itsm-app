import { object, z } from "zod";
import { RoleEnum } from "../constants/role.constant";
import { StatusEnum } from "../constants/status.constant";
import { permissionSchema } from "../../permissions/validations/permission.schema";

export const userSchema = object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.nativeEnum(RoleEnum),
  status: z.nativeEnum(StatusEnum),
  permissions: z.array(permissionSchema),
});
