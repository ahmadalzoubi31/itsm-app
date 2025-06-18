import { UserRole } from "@/types/globals";
import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  username: z.string(),
  role: z.string().refine((val) => Object.values(UserRole).includes(val as UserRole), {
    message: "Invalid user role",
  }),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

import { object, string } from "zod";

export const createUserSchema = object({
  name: string({ required_error: "Name is required" }).min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: string({ required_error: "Email is required" }).min(1, "Email is required").email("Invalid email"),
  username: string({ required_error: "Username is required" }).min(1, "Username is required").max(50, "Username must be less than 50 characters"),
  password: string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});
