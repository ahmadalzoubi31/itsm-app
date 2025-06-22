import { object, z, string } from "zod";
import { RoleEnum } from "../constants/role.constant";
import { StatusEnum } from "../constants/status.constant";

export const createUserSchema = object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.nativeEnum(RoleEnum),
  status: z.nativeEnum(StatusEnum),
});

// export const editUserSchema = object({
//   firstName: string({ required_error: "First name is required" })
//     .min(1, "First name is required")
//     .max(100, "First name must be less than 100 characters"),
//   lastName: string({ required_error: "Last name is required" })
//     .min(1, "Last name is required")
//     .max(100, "Last name must be less than 100 characters"),
//   email: string({ required_error: "Email is required" })
//     .min(1, "Email is required")
//     .email("Invalid email"),
//   password: string({ required_error: "Password is required" })
//     .min(8, "Password must be more than 8 characters")
//     .max(32, "Password must be less than 32 characters")
//     .optional(),
//   role: z.string().refine((val) => Object.values(Role).includes(val as Role), {
//     message: "Invalid user role",
//   }),
//   phone: z.string().optional(),
//   address: z.string().optional(),
//   status: z
//     .string()
//     .refine((val) => Object.values(Status).includes(val as Status), {
//       message: "Invalid user status",
//     }),
// });
