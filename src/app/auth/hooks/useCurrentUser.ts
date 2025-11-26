import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/auth.service";
import { User } from "@/app/(core)/iam/users/_lib/_types/user.type";

export function useCurrentUser() {
  const { data, error, isLoading, refetch } = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return {
    user: data,
    error,
    isLoading,
    refetch,
  };
}
