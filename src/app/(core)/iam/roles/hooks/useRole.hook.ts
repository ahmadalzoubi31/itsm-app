import { useQuery } from "@tanstack/react-query";
import { Role } from "../interfaces/role.interface";
import { getRoleById } from "../services/role.service";

export function useRoleHook(id: string) {
  const { data, error, isLoading, refetch } = useQuery<Role>({
    queryKey: ["role", id],
    queryFn: () => getRoleById(id),
  });

  return {
    role: data,
    error,
    isLoading,
    refetch,
  };
}
