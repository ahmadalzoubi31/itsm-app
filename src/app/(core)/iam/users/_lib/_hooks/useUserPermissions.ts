import { useQuery } from "@tanstack/react-query";
import { getUserPermissions } from "../../../permissions/services/permission.service";
import type { Permission } from "../../../permissions/interfaces/permission.interface";

export function useUserPermissions(id: string) {
  const query = useQuery<Permission[]>({
    queryKey: ["user-permissions", id],
    queryFn: () => getUserPermissions(id),
    enabled: Boolean(id),
  });

  return {
    userPermissions: query.data ?? [],
    error: query.error,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
