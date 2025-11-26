// src/app/(core)/catalog/admin/services/_lib/_hooks/useServices.hook.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import type { Service } from "../_types/service.type.ts";
import { listServices, getService } from "../_services/service.service";

/**
 * Hook to fetch all services
 */
export function useServicesHook() {
  const { data, error, isLoading, refetch } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: () => listServices(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return {
    services: data ?? [],
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to fetch a single service by ID
 */
export function useServiceHook(serviceId: string) {
  const { data, error, isLoading, refetch } = useQuery<Service>({
    queryKey: ["service", serviceId],
    queryFn: () => getService(serviceId),
    enabled: !!serviceId,
  });

  return {
    service: data,
    error,
    isLoading,
    refetch,
  };
}
