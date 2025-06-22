import { useQuery } from "@tanstack/react-query";
import { fetchPermissionById } from "../services/permission.service";
import { Permission } from "../types";
import { ApiResponse } from "@/types/globals";

export function usePermission(id: string) {
  const { data, error, isLoading, refetch } = useQuery<ApiResponse<Permission>>(
    {
      queryKey: ["permission", id],
      queryFn: () => fetchPermissionById(id),
      enabled: !!id, // Only run if id exists
    }
  );

  return {
    permission: data ?? null,
    error,
    isLoading,
    refetch,
  };
}
