import { useQuery } from "@tanstack/react-query";
import { fetchServiceCards } from "../../service-cards/services/service-card.service";
import { ServiceCard } from "../../service-cards/types";
import { ApiResponse } from "@/types/globals";

export function useServiceCards() {
  const { data, error, isLoading, refetch } = useQuery<
    ApiResponse<ServiceCard[]>
  >({
    queryKey: ["service-cards-active"],
    queryFn: fetchServiceCards,
    select: (data) => ({
      ...data,
      data: data.data?.filter((card) => card.isActive) ?? [],
    }),
  });

  const serviceCards = data?.data ?? [];

  return {
    serviceCards,
    error,
    isLoading,
    refetch,
  };
}
