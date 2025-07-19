import { useQuery } from "@tanstack/react-query";
import { fetchServiceCards } from "../services/service-card.service";
import { ServiceCard } from "../types";
import { ApiResponse } from "@/types/globals";

export function useServiceCards() {
  const { data, error, isLoading, refetch } = useQuery<ApiResponse<ServiceCard[]>>({
    queryKey: ["service-cards"],
    queryFn: fetchServiceCards,
  });

  const serviceCards = data?.data ?? [];

  return {
    serviceCards,
    error,
    isLoading,
    refetch,
  };
}
