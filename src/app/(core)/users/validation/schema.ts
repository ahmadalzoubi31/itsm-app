import { Status, UserRole } from "@/types/globals";
import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  username: z.string(),
  role: z
    .string()
    .refine((val) => Object.values(UserRole).includes(val as UserRole), {
      message: "Invalid user role",
    }),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

import { object, string } from "zod";

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
  password: string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .optional(),
  role: z
    .string()
    .refine((val) => Object.values(UserRole).includes(val as UserRole), {
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
  role: z
    .string()
    .refine((val) => Object.values(UserRole).includes(val as UserRole), {
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
