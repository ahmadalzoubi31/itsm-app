// src/app/(core)/catalog/admin/subcategories/_lib/_hooks/useSubcategory.ts

"use client";

import { useQuery } from "@tanstack/react-query";

import { getSubcategory } from "../_services/subcategory.service";
import type { CatalogSubcategory } from "../_types";

export function useSubcategoryHook(id: string | undefined) {
  const { data, error, isLoading, refetch } = useQuery<CatalogSubcategory>({
    queryKey: ["catalog-subcategory", id],
    queryFn: () => getSubcategory(id as string),
    enabled: !!id,
  });

  return {
    subcategory: data,
    error,
    isLoading,
    refetch,
  };
}
