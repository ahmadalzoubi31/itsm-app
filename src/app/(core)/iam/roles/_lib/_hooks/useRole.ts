// app/(core)/iam/roles/_lib/_hooks/useRole.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { getRoleById } from "../_services/role.service";
import type { Role } from "../_types/role.type";

export function useRole(id: string) {
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
