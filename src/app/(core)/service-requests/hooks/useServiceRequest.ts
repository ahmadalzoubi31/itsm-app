import { useQuery } from "@tanstack/react-query";
import { fetchServiceRequestById } from "../services/request.service";
import { ServiceRequest } from "../types";
import { ApiResponse } from "@/types/globals";

export function useServiceRequest(id: string) {
  const { data, error, isLoading, refetch } = useQuery<
    ApiResponse<ServiceRequest>
  >({
    queryKey: ["service-request", id],
    queryFn: () => fetchServiceRequestById(id),
    enabled: !!id, // Only run if id exists
  });

  return {
    serviceRequest: data?.data ?? null,
    error,
    isLoading,
    refetch,
  };
}
