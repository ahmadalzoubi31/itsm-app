import { useQuery } from "@tanstack/react-query";
import { fetchServiceTemplateById } from "../services/service-card.service";
import { ServiceTemplate } from "../types";
import { ApiResponse } from "@/types/globals";

export function useServiceTemplate(id: string) {
  const { data, error, isLoading, refetch } = useQuery<
    ApiResponse<ServiceTemplate>
  >({
    queryKey: ["service-template", id],
    queryFn: () => fetchServiceTemplateById(id),
    enabled: !!id, // Only run if id exists
  });

  return {
    serviceTemplate: data?.data ?? null,
    error,
    isLoading,
    refetch,
  };
}
