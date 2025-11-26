// src/app/(core)/catalog/admin/categories/_lib/_hooks/useCategories.hook.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import { listCategories } from "../_services/category.service";
import type { CatalogCategory } from "../_types";

export function useCategoriesHook() {
  const {
    data = [],
    error,
    isLoading,
    refetch,
  } = useQuery<CatalogCategory[]>({
    queryKey: ["catalog-categories"],
    queryFn: () => listCategories(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    categories: data,
    error,
    isLoading,
    refetch,
  };
}
