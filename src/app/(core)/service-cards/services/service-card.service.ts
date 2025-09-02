import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { ApiResponse } from "@/types/globals";
import { ServiceCard } from "../types";

// DTO type that matches the backend CreateServiceCardDto
type CreateServiceCardDto = {
  name: string;
  description?: string;
  category: string;
  estimatedTime?: string;
  price: string;
  icon?: any;
  isActive?: boolean;
  config?: any;
};

// Get all users
export async function fetchServiceCards(): Promise<ApiResponse<ServiceCard[]>> {
  const res = await fetchWithAuth(getBackendUrl("/api/service-cards"), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch service cards");
  return res.json();
}

// Get service template by ID
export async function fetchServiceCardById(
  id: string
): Promise<ApiResponse<ServiceCard>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/service-cards/${id}`), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch service card");
  return res.json();
}

// Create new service template
export async function createServiceCard(
  payload: Partial<ServiceCard>
): Promise<ApiResponse<ServiceCard>> {
  // Filter payload to only include properties supported by backend
  const filteredPayload: CreateServiceCardDto = {
    name: payload.name!,
    description: payload.description,
    category: payload.category!,
    estimatedTime: payload.estimatedTime,
    price: payload.price!,
    icon: payload.icon,
    isActive: payload.isActive,
    config: payload.config,
  };

  const res = await fetchWithAuth(getBackendUrl("/api/service-cards"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filteredPayload),
  });
  if (!res.ok) throw new Error("Failed to create service card");
  return res.json();
}

// Update service template
export async function updateServiceCard(
  id: string,
  payload: Partial<ServiceCard>
): Promise<ApiResponse<ServiceCard>> {
  // Filter payload to only include properties supported by backend
  const filteredPayload: Partial<CreateServiceCardDto> = {
    name: payload.name,
    description: payload.description,
    category: payload.category,
    estimatedTime: payload.estimatedTime,
    price: payload.price,
    icon: payload.icon,
    isActive: payload.isActive,
    config: payload.config,
  };

  const res = await fetchWithAuth(getBackendUrl(`/api/service-cards/${id}`), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filteredPayload),
  });
  if (!res.ok) throw new Error("Failed to update service card");
  return res.json();
}

// Delete service template
export async function deleteServiceCard(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/service-cards/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete service card");
  return res.json();
}
