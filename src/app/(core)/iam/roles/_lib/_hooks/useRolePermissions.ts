// app/(core)/iam/roles/_lib/_hooks/useRolePermissions.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { getRolePermissions } from "@/app/(core)/iam/permissions/services/permission.service";
import type { Role } from "../_types/role.type";
import type { Permission } from "@/app/(core)/iam/permissions/interfaces/permission.interface";

export function useRolePermissions(roles: Role[]) {
  const roleIds = roles.map((r) => r.id);

  const { data, error, isLoading, refetch } = useQuery<Permission[]>({
    queryKey: ["role-permissions", roleIds],
    queryFn: async () => {
      if (roleIds.length === 0) return [];

      const responses = await Promise.all(
        roleIds.map(async (roleId) => {
          const res = await getRolePermissions(roleId);
          return res.permissions;
        })
      );

      return responses.flat();
    },
    enabled: roleIds.length > 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    rolePermissions: data ?? [],
    error,
    isLoading,
    refetch,
  };
}
