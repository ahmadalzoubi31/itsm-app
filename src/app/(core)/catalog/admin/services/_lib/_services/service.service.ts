// src/app/(core)/catalog/admin/services/_lib/_services/service.service.ts

import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { SERVICES_ENDPOINTS } from "@/lib/api/endpoints/catalog";

import type { Service } from "../_types/service.type";
import type {
  CreateServiceDto,
  UpdateServiceDto,
} from "../_types/service-dto.type";

export async function listServices(): Promise<Service[]> {
  return await fetchWithAuth(getBackendUrl(SERVICES_ENDPOINTS.base), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function getService(id: string): Promise<Service> {
  return await fetchWithAuth(getBackendUrl(SERVICES_ENDPOINTS.byId(id)), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function createService(dto: CreateServiceDto): Promise<Service> {
  return await fetchWithAuth(getBackendUrl(SERVICES_ENDPOINTS.base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function updateService(
  id: string,
  dto: UpdateServiceDto
): Promise<Service> {
  return await fetchWithAuth(getBackendUrl(SERVICES_ENDPOINTS.byId(id)), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function deleteService(id: string): Promise<{ ok: boolean }> {
  return await fetchWithAuth(getBackendUrl(SERVICES_ENDPOINTS.byId(id)), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}
