import { z } from "zod";

export const ldapSchema = z.object({
  server: z.string().min(1, { message: "Server is required" }),
  port: z.coerce
    .number()
    .int()
    .positive({ message: "Port must be a positive number" }),
  protocol: z.enum(["ldap", "ldaps"]),
  baseDn: z.string().min(1, { message: "Base DN is required" }),
  bindDn: z.string(),
  bindPassword: z.string(),
  searchFilter: z.string(),
  attributes: z.string(),
  useSSL: z.boolean(),
  validateCert: z.boolean(),
});
