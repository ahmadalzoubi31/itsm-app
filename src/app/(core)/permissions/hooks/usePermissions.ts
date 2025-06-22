import { useQuery } from "@tanstack/react-query";
import { fetchPermissions } from "../services/permission.service";
import { Permission } from "../types";
import { ApiResponse } from "@/types/globals";

export function usePermissions() {
  const { data, error, isLoading, refetch } = useQuery<
    ApiResponse<Permission[]>
  >({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
  });

  const permissions = data?.data ?? [];

  return {
    permissions,
    error,
    isLoading,
    refetch,
  };
}
