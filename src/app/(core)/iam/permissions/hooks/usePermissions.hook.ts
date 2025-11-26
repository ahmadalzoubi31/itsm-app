import { useQuery } from "@tanstack/react-query";
import { listPermissions } from "../services/permission.service";
import { Permission } from "../interfaces/permission.interface";

export function usePermissionsHook() {
  const { data, error, isLoading, refetch } = useQuery<Permission[]>({
    queryKey: ["permissions"],
    queryFn: () => listPermissions(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const permissions = data ?? [];

  return {
    permissions,
    error,
    isLoading,
    refetch,
  };
}
