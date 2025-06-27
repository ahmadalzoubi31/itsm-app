import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { ApiResponse } from "@/types/globals";
import { ServiceRequest } from "../types";

// Get all users
export async function fetchServiceRequests(): Promise<
  ApiResponse<ServiceRequest[]>
> {
  const res = await fetchWithAuth(getBackendUrl("/api/service-requests"), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch service requests");
  return res.json();
}

// Get service request by ID
export async function fetchServiceRequestById(
  id: string
): Promise<ApiResponse<ServiceRequest>> {
  const res = await fetchWithAuth(
    getBackendUrl(`/api/service-requests/${id}`),
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch service request");
  return res.json();
}

// Create new service request
export async function createServiceRequest(
  payload: Partial<ServiceRequest>
): Promise<ApiResponse<ServiceRequest>> {
  const res = await fetchWithAuth(getBackendUrl("/api/service-requests"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create service request");
  return res.json();
}

// Update service request
export async function updateServiceRequest(
  id: string,
  payload: Partial<ServiceRequest>
): Promise<ApiResponse<ServiceRequest>> {
  const res = await fetchWithAuth(
    getBackendUrl(`/api/service-requests/${id}`),
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) throw new Error("Failed to update service request");
  return res.json();
}

// Delete service request
export async function deleteServiceRequest(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchWithAuth(
    getBackendUrl(`/api/service-requests/${id}`),
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to delete service request");
  return res.json();
}
