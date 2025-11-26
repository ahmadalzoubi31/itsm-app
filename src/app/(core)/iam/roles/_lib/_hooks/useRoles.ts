// app/(core)/iam/roles/_lib/_hooks/useRoles.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { listRoles } from "../_services/role.service";
import type { Role } from "../_types/role.type";

export function useRoles() {
  const { data, error, isLoading, refetch } = useQuery<Role[]>({
    queryKey: ["roles"],
    queryFn: listRoles,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return {
    roles: data ?? [],
    error,
    isLoading,
    refetch,
  };
}
