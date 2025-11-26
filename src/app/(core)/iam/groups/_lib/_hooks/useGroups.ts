import { useQuery } from "@tanstack/react-query";
import { Group } from "../_types/group.type";
import { listGroups } from "../_services/group.service";

export function useGroupsHook() {
  const { data, error, isLoading, refetch } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () => listGroups(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const groups = data ?? [];

  return {
    groups,
    error,
    isLoading,
    refetch,
  };
}
