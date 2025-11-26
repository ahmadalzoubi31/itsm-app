// src/app/(core)/catalog/admin/categories/_lib/_hooks/useCategory.hook.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import { getCategory } from "../_services/category.service";
import type { CatalogCategory } from "../_types";

export function useCategoryHook(id: string | undefined) {
  const { data, error, isLoading, refetch } = useQuery<CatalogCategory>({
    queryKey: ["catalog-category", id],
    queryFn: () => getCategory(id as string),
    enabled: !!id,
  });

  return {
    category: data,
    error,
    isLoading,
    refetch,
  };
}
