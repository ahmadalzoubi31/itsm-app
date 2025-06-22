import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "../services/user.service";
import { User } from "../types";
import { ApiResponse } from "@/types/globals";

export function useUser(id: string) {
  const { data, error, isLoading, refetch } = useQuery<ApiResponse<User>>({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id, // Only run if id exists
  });

  return {
    user: data ?? null,
    error,
    isLoading,
    refetch,
  };
}
