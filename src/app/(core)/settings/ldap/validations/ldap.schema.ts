import { z } from "zod";

export const ldapSchema = z.object({
  server: z.string(),
  port: z.string(),
  protocol: z.string(),
  baseDN: z.string(),
  bindDN: z.string(),
  bindPassword: z.string(),
  userSearchBase: z.string(),
  userSearchFilter: z.string(),
  userNameAttribute: z.string(),
  emailAttribute: z.string(),
  displayNameAttribute: z.string(),
  isEnabled: z.boolean(),
  secureConnection: z.boolean(),
  allowSelfSignedCert: z.boolean(),
  groupMappings: z.object({}).optional(),
});
