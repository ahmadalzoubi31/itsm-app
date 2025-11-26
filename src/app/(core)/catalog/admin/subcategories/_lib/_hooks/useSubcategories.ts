// src/app/(core)/catalog/admin/subcategories/_lib/_hooks/useSubcategories.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import { listSubcategories } from "../_services/subcategory.service";
import type { CatalogSubcategory } from "../_types";

export function useSubcategoriesHook(categoryId?: string) {
  const { data, error, isLoading, refetch } = useQuery<CatalogSubcategory[]>({
    queryKey: categoryId
      ? ["catalog-subcategories", categoryId]
      : ["catalog-subcategories"],
    queryFn: () => listSubcategories(categoryId),
  });

  return {
    subcategories: data ?? [],
    error,
    isLoading,
    refetch,
  };
}
