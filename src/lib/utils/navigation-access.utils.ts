import { Role } from "@/app/(core)/iam/roles/_types/role.interface";

import { Permission } from "@/app/(core)/iam/permissions/interfaces/permission.interface";
import { User } from "@/app/(core)/iam/users/_lib/_types/user.type";

export type NavigationItem = {
  title: string;
  url: string;
  icon: string;
  roles?: string[]; // Array of role names/keys that can access this item
  permissions?: string[];
};

/**
 * Checks if a user has access to a navigation item based on roles and/or permissions
 *
 * Access rules:
 * - If item has no roles and no permissions: accessible to everyone
 * - If item has roles only: user must have one of the specified roles
 * - If item has permissions only: user must have at least one of the specified permissions
 * - If item has both roles and permissions: user must have either the role OR the permission (OR logic)
 *
 * @param item - Navigation item to check access for
 * @param user - Current logged-in user (optional, if null, returns false)
 * @returns true if user has access, false otherwise
 */
export function hasNavigationAccess(
  item: NavigationItem,
  user: User | undefined | null
): boolean {
  // No user = no access
  if (!user) {
    return false;
  }

  // No restrictions = accessible to everyone
  if (!item.roles?.length && !item.permissions?.length) {
    return true;
  }

  // Check role access - user must have at least one of the required roles
  const hasRoleAccess = item.roles?.length
    ? item.roles.some((requiredRole) =>
        user.roles.some(
          (userRole: Role) =>
            userRole.id === requiredRole ||
            String(userRole).toLowerCase() ===
              String(requiredRole).toLowerCase()
        )
      )
    : false;

  // Check permission access
  const hasPermissionAccess = item.permissions?.length
    ? item.permissions.some((requiredPermission) =>
        user.permissions.some(
          (userPermission: Permission) =>
            userPermission.id === requiredPermission ||
            userPermission.key === requiredPermission
        )
      )
    : false;

  // If both roles and permissions are specified, use OR logic
  // If only one is specified, use that check
  if (item.roles?.length && item.permissions?.length) {
    return hasRoleAccess || hasPermissionAccess;
  }

  return hasRoleAccess || hasPermissionAccess;
}

/**
 * Filters navigation items based on user access
 *
 * @param items - Array of navigation items
 * @param user - Current logged-in user (optional)
 * @returns Filtered array of navigation items the user can access
 */
export function filterNavigationItems<T extends NavigationItem>(
  items: T[],
  user: User | undefined | null
): T[] {
  return items.filter((item) => hasNavigationAccess(item, user));
}
