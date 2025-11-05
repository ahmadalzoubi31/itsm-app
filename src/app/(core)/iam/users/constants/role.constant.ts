/**
 * @deprecated Roles are now stored in the backend database and are additive.
 * Use string literals (e.g., "admin", "agent", "end_user") instead.
 * This enum is kept for backward compatibility and convenience only.
 */
export enum RoleEnum {
  ADMIN = "admin",
  USER = "end_user", // Legacy: use "end_user" or "requester" instead
  AGENT = "agent",
}

/**
 * @deprecated Use roles fetched from the backend API instead.
 * This constant is kept for backward compatibility only.
 */
export const ROLES = [
  { value: RoleEnum.ADMIN, label: "Admin" },
  { value: RoleEnum.AGENT, label: "Agent" },
  { value: RoleEnum.USER, label: "User" },
] as const;
