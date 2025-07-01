import { useQuery } from "@tanstack/react-query";
import { fetchServiceTemplates } from "../services/template.service";
import { ServiceTemplate } from "../types";
import { ApiResponse } from "@/types/globals";

export function useServiceTemplates() {
  const { data, error, isLoading, refetch } = useQuery<
    ApiResponse<ServiceTemplate[]>
  >({
    queryKey: ["service-templates"],
    queryFn: fetchServiceTemplates,
  });

  const serviceTemplates = data?.data ?? [];

  return {
    serviceTemplates,
    error,
    isLoading,
    refetch,
  };
}
