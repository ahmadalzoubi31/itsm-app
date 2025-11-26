// src/app/(core)/iam/groups/hooks/useGroups.ts

import { useQuery } from "@tanstack/react-query";
import { listGroups } from "../_services/group.service";
import type { Group } from "../_types/group.type";

export function useGroups() {
  const query = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: listGroups,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return {
    groups: query.data ?? [],
    error: query.error,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
