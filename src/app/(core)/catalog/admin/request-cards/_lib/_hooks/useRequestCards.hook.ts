"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { RequestCard } from "@/app/(core)/catalog/admin/request-cards/_lib/_types/request-card.type";
import {
  createRequestCard,
  fetchRequestCardById,
  fetchRequestCards,
  fetchRequestCardsByService,
  updateRequestCard,
} from "../_services/request-card.service";
import {
  CreateRequestCardDto,
  UpdateRequestCardDto,
} from "../_types/request-card-dto.type";

/**
 * Hook to fetch all request cards
 */
export function useRequestCardsHook() {
  const {
    data: requestCards = [],
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["requestCards"],
    queryFn: fetchRequestCards,
  });

  return {
    requestCards,
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to fetch request cards by service ID
 */
export function useRequestCardsByServiceHook(serviceId: string) {
  console.log("🚀 ~ useRequestCardsByServiceHook ~ serviceId:", serviceId);
  const {
    data: requestCards = [],
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["requestCards", serviceId],
    queryFn: () => fetchRequestCardsByService(serviceId),
    enabled: !!serviceId,
  });

  return {
    requestCards,
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to fetch a single request card by ID
 */
export function useRequestCardHook(requestCardId: string) {
  const {
    data: requestCard,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["requestCard", requestCardId],
    queryFn: () => fetchRequestCardById(requestCardId),
    enabled: !!requestCardId,
  });

  return {
    requestCard,
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to create a new request card
 */
export function useCreateRequestCardHook() {
  const queryClient = useQueryClient();

  const mutation = useMutation<RequestCard, Error, CreateRequestCardDto>({
    mutationFn: (payload) => createRequestCard(payload),
    onSuccess: (data) => {
      // Invalidate and refetch request cards for the service
      if (data.serviceId) {
        queryClient.invalidateQueries({
          queryKey: ["requestCards", data.serviceId],
        });
      }
      // Invalidate all request cards queries
      queryClient.invalidateQueries({ queryKey: ["requestCards"] });
    },
  });

  return {
    createRequestCard: mutation.mutate,
    createRequestCardAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    createdRequestCard: mutation.data,
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}

/**
 * Hook to update an existing request card
 */
export function useUpdateRequestCardHook() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    RequestCard,
    Error,
    { id: string; payload: UpdateRequestCardDto }
  >({
    mutationFn: ({ id, payload }) => updateRequestCard(id, payload),
    onSuccess: (data, variables) => {
      // Invalidate the specific request card
      queryClient.invalidateQueries({
        queryKey: ["requestCard", variables.id],
      });
      // Invalidate request cards for the service
      if (data.serviceId) {
        queryClient.invalidateQueries({
          queryKey: ["requestCards", data.serviceId],
        });
      }
      // Invalidate all request cards queries
      queryClient.invalidateQueries({ queryKey: ["requestCards"] });
    },
  });

  return {
    updateRequestCard: mutation.mutate,
    updateRequestCardAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    error: mutation.error,
    updatedRequestCard: mutation.data,
    reset: mutation.reset,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
  };
}
