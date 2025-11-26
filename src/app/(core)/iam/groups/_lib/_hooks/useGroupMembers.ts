import { useQuery } from "@tanstack/react-query";
import { getGroupMembers } from "../_services/group.service";
import type { User } from "@/app/(core)/iam/users/_lib/_types";

export function useGroupMembers(groupId: string, enabled: boolean = true) {
  const query = useQuery<User[]>({
    queryKey: ["group-members", groupId],
    queryFn: () => getGroupMembers(groupId),
    enabled: enabled && !!groupId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return {
    members: query.data ?? [],
    error: query.error,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

// Re-export the service function for direct use in useQuery
export { getGroupMembers } from "../_services/group.service";
