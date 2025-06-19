import { object, z, string } from "zod";
import { Status } from "@/types/globals";
import { Role } from "../data/enums";



export const createUserSchema = object({
  firstName: string({ required_error: "First name is required" })
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastName: string({ required_error: "Last name is required" })
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  username: string({ required_error: "Username is required" })
    .min(1, "Username is required")
    .max(50, "Username must be less than 50 characters"),
  password: string().optional(),
  role: z.string().refine((val) => Object.values(Role).includes(val as Role), {
    message: "Invalid user role",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z
    .string()
    .refine((val) => Object.values(Status).includes(val as Status), {
      message: "Invalid user status",
    }),
});

export const editUserSchema = object({
  firstName: string({ required_error: "First name is required" })
    .min(1, "First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastName: string({ required_error: "Last name is required" })
    .min(1, "Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .optional(),
  role: z.string().refine((val) => Object.values(Role).includes(val as Role), {
    message: "Invalid user role",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z
    .string()
    .refine((val) => Object.values(Status).includes(val as Status), {
      message: "Invalid user status",
    }),
});
