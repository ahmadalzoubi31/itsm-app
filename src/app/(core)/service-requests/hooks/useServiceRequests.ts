import { useQuery } from "@tanstack/react-query";
import { fetchServiceRequests } from "../services/request.service";
import { ServiceRequest } from "../types";
import { ApiResponse } from "@/types/globals";

export function useServiceRequests() {
  const { data, error, isLoading, refetch } = useQuery<
    ApiResponse<ServiceRequest[]>
  >({
    queryKey: ["service-requests"],
    queryFn: fetchServiceRequests,
  });

  const serviceRequests = data?.data ?? [];

  return {
    serviceRequests,
    error,
    isLoading,
    refetch,
  };
}
