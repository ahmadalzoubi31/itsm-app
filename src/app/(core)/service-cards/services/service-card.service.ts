import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { ApiResponse } from "@/types/globals";
import { ServiceTemplate } from "../types";

// Get all users
export async function fetchServiceTemplates(): Promise<
  ApiResponse<ServiceTemplate[]>
> {
  const res = await fetchWithAuth(getBackendUrl("/api/service-templates"), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch service templates");
  return res.json();
}

// Get service template by ID
export async function fetchServiceTemplateById(
  id: string
): Promise<ApiResponse<ServiceTemplate>> {
  const res = await fetchWithAuth(
    getBackendUrl(`/api/service-templates/${id}`),
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch service template");
  return res.json();
}

// Create new service template
export async function createServiceTemplate(
  payload: Partial<ServiceTemplate>
): Promise<ApiResponse<ServiceTemplate>> {
  const res = await fetchWithAuth(getBackendUrl("/api/service-templates"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create service template");
  return res.json();
}

// Update service template
export async function updateServiceTemplate(
  id: string,
  payload: Partial<ServiceTemplate>
): Promise<ApiResponse<ServiceTemplate>> {
  const res = await fetchWithAuth(
    getBackendUrl(`/api/service-templates/${id}`),
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("Failed to update service template");
  return res.json();
}

// Delete service template
export async function deleteServiceTemplate(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchWithAuth(
    getBackendUrl(`/api/service-templates/${id}`),
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to delete service template");
  return res.json();
}
