import { useQuery } from "@tanstack/react-query";
import { fetchGroupById } from "../services/group.service";
import { Group } from "../types";
import { ApiResponse } from "@/types/globals";

export function useGroup(id: string) {
  const { data, error, isLoading, refetch } = useQuery<ApiResponse<Group>>({
    queryKey: ["group", id],
    queryFn: () => fetchGroupById(id),
    enabled: !!id,
  });

  const group = data?.data;

  return {
    group,
    error,
    isLoading,
    refetch,
  };
} 