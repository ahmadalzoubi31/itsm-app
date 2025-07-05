import { z } from "zod";
import { ProtocolEnum } from "../constants/protocol.constant";
import { SearchScopeEnum } from "../constants/search-scope.constant";

export const ldapSchema = z.object({
  server: z.string().min(1, { message: "Server is required" }),
  port: z.coerce
    .number()
    .int()
    .positive({ message: "Port must be a positive number" }),
  protocol: z.enum([ProtocolEnum.LDAP, ProtocolEnum.LDAPS]),
  bindDn: z.string(),
  bindPassword: z.string(),
  searchBase: z.string().min(1, { message: "Search Base is required" }),
  searchScope: z.enum([
    SearchScopeEnum.SUB,
    SearchScopeEnum.ONE_LEVEL,
    SearchScopeEnum.BASE,
  ]),
  searchFilter: z.string(),
  attributes: z.string(),
  useSSL: z.boolean(),
  validateCert: z.boolean(),
});
