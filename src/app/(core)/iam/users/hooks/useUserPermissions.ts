import { useQueries } from "@tanstack/react-query";
import { getUserPermissions } from "../../permissions/services/permission.service";
import { Permission } from "../../permissions/interfaces/permission.interface";
import { Role } from "../interfaces/role.interface";

/**
 * Hook to fetch and cache permissions for multiple roles
 * Uses React Query to cache permissions per role, so switching tabs is instant
 */
export function useRolePermissions(roles: Role[]) {
  const queries = useQueries({
    queries: roles.map((role) => ({
      queryKey: ["role-permissions", role.id],
      queryFn: () => getUserPermissions(role.id),
      enabled: !!role.id,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    })),
  });
  // Check if any query is loading
  const isLoading = queries.some((query) => query.isLoading);

  // Check if any query has error
  const hasError = queries.some((query) => query.isError);

  // Flatten all permissions from all roles and remove duplicates
  const allPermissions: Permission[] = queries
    .map((query) => query.data || [])
    .flat()
    .filter((permission, index, self) => index === self.findIndex((p) => p.id === permission.id));

  return {
    permissions: allPermissions,
    isLoading,
    hasError,
    errors: queries.map((query, index) => (query.error ? { role: roles[index], error: query.error } : null)).filter(Boolean),
  };
}
