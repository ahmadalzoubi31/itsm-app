// src/app/(core)/catalog/admin/subcategories/_lib/_services/subcategory.service.ts

import type { CatalogSubcategory } from "../_types";
import type { SubcategoryFormValues } from "../_schemas/subcategory.schema";
import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { CATEGORIES_ENDPOINTS } from "@/lib/api/endpoints/categories";

export async function listSubcategories(
  categoryId?: string
): Promise<CatalogSubcategory[]> {
  return await fetchWithAuth(
    getBackendUrl(CATEGORIES_ENDPOINTS.subcategories.list(categoryId)),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function getSubcategory(id: string): Promise<CatalogSubcategory> {
  return await fetchWithAuth(
    getBackendUrl(CATEGORIES_ENDPOINTS.subcategories.byId(id)),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function createSubcategory(
  dto: Omit<SubcategoryFormValues, "id" | "active">
): Promise<CatalogSubcategory> {
  return await fetchWithAuth(
    getBackendUrl(CATEGORIES_ENDPOINTS.subcategories.base),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }
  );
}

export async function updateSubcategory(
  id: string,
  dto: Omit<SubcategoryFormValues, "id" | "key">
): Promise<CatalogSubcategory> {
  return await fetchWithAuth(
    getBackendUrl(CATEGORIES_ENDPOINTS.subcategories.byId(id)),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    }
  );
}

export async function deleteSubcategory(id: string): Promise<void> {
  await fetchWithAuth(
    getBackendUrl(CATEGORIES_ENDPOINTS.subcategories.byId(id)),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
}
