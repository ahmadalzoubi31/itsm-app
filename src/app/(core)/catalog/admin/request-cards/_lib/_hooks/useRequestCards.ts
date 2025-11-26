// src/app/(core)/catalog/admin/request-cards/_lib/_hooks/useRequestCards.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import type { RequestCard } from "../_types";
import {
  fetchRequestCards,
  fetchRequestCardById,
  fetchRequestCardsByService,
} from "../_services/request-card.service";

/**
 * Hook to fetch all request cards
 */
export function useRequestCards() {
  const { data, error, isLoading, refetch } = useQuery<RequestCard[]>({
    queryKey: ["request-cards"],
    queryFn: () => fetchRequestCards(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return {
    requestCards: data ?? [],
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to fetch a single request card by ID
 */
export function useRequestCard(requestCardId: string) {
  const { data, error, isLoading, refetch } = useQuery<RequestCard>({
    queryKey: ["request-card", requestCardId],
    queryFn: () => fetchRequestCardById(requestCardId),
    enabled: !!requestCardId,
  });

  return {
    requestCard: data,
    error,
    isLoading,
    refetch,
  };
}

/**
 * Hook to fetch request cards by service ID
 */
export function useRequestCardsByService(serviceId: string) {
  const { data, error, isLoading, refetch } = useQuery<RequestCard[]>({
    queryKey: ["request-cards", "service", serviceId],
    queryFn: () => fetchRequestCardsByService(serviceId),
    enabled: !!serviceId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  return {
    requestCards: data ?? [],
    error,
    isLoading,
    refetch,
  };
}
