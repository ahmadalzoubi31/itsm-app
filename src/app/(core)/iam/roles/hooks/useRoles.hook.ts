import { useQuery } from "@tanstack/react-query";
import { Role } from "../interfaces/role.interface";
import { listRoles } from "../services/role.service";

export function useRolesHook() {
  const { data, error, isLoading, refetch } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: () => listRoles(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const roles = data ?? [];

  return {
    roles,
    error,
    isLoading,
    refetch,
  };
}
