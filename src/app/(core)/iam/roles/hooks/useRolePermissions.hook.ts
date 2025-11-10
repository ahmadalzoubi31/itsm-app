import { useQuery } from "@tanstack/react-query";
import { Role } from "../interfaces/role.interface";
import { getRolePermissions } from "../../permissions/services/permission.service";
import { Permission } from "../../permissions/interfaces/permission.interface";

export function useRolePermissionsHook(roles: Role[]) {
  const { data, error, isLoading, refetch } = useQuery<Permission[]>({
    queryKey: ["rolePermissions", roles.map((role) => role.id)],
    queryFn: async () =>
      await Promise.all(
        roles.map((role) =>
          getRolePermissions(role.id).then((res) => res.permissions)
        )
      ).then((res) => res.flat()),
  });

  return {
    rolePermissions: data,
    error,
    isLoading,
    refetch,
  };
}
