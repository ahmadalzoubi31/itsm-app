import { useQuery } from "@tanstack/react-query";
import { fetchServiceCardById } from "../services/service-card.service";
import { ServiceCard } from "../types";
import { ApiResponse } from "@/types/globals";

export function useServiceCard(id: string) {
  const { data, error, isLoading, refetch } = useQuery<
    ApiResponse<ServiceCard>
  >({
    queryKey: ["service-card", id],
    queryFn: () => fetchServiceCardById(id),
    enabled: !!id, // Only run if id exists
  });

  return {
    serviceCard: data?.data ?? null,
    error,
    isLoading,
    refetch,
  };
}
