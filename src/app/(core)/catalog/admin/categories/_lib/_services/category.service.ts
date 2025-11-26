// src/app/(core)/catalog/admin/categories/_lib/_services/category.service.ts

import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { CATEGORIES_ENDPOINTS } from "@/lib/api/endpoints/categories";

import type {
  CatalogCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../_types";

export async function listCategories(): Promise<CatalogCategory[]> {
  return await fetchWithAuth(getBackendUrl(CATEGORIES_ENDPOINTS.base), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function getCategory(id: string): Promise<CatalogCategory> {
  return await fetchWithAuth(getBackendUrl(CATEGORIES_ENDPOINTS.byId(id)), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function createCategory(
  dto: CreateCategoryDto
): Promise<CatalogCategory> {
  return await fetchWithAuth(getBackendUrl(CATEGORIES_ENDPOINTS.base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function updateCategory(
  id: string,
  dto: UpdateCategoryDto
): Promise<CatalogCategory> {
  return await fetchWithAuth(getBackendUrl(CATEGORIES_ENDPOINTS.byId(id)), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function deleteCategory(id: string): Promise<{ ok: boolean }> {
  return await fetchWithAuth(getBackendUrl(CATEGORIES_ENDPOINTS.byId(id)), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
