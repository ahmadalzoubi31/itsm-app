import { z } from "zod";

export const ldapSchema = z.object({
  name: z.string().min(1, "Name is required"),
  server: z.string().min(1, "Server is required"),
  port: z.number().min(1, "Port is required"),
  protocol: z.string().min(1, "Protocol is required"),
  baseDN: z.string().min(1, "Base DN is required"),
  bindDN: z.string().min(1, "Bind DN is required"),
  bindPassword: z.string().optional(), // Optional for updates (only required when creating new config)
  userSearchBase: z.string().min(1, "User Search Base is required"),
  userSearchFilter: z.string().min(1, "User Search Filter is required"),
  userSearchScope: z.string().min(1, "User Search Scope is required"),
  attributes: z.record(z.string(), z.string()).optional(),
  isEnabled: z.boolean(),
  secureConnection: z.boolean(),
  allowSelfSignedCert: z.boolean(),
  groupMappings: z.record(z.string(), z.array(z.string())).optional(),
  roleMappings: z.record(z.string(), z.array(z.string())).optional(),
  syncIntervalMinutes: z.number().optional(),
  autoSync: z.boolean().optional(),
  deactivateRemovedUsers: z.boolean().optional(),
  connectionTimeout: z.number().optional(),
  pageSizeLimit: z.number().optional(),
  stagingMode: z.enum(["full", "new-only", "disabled"]).optional(),
});
