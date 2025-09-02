import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { ApiResponse } from "@/types/globals";
import { ServiceRequest } from "../types";

// DTO type that matches the backend CreateServiceRequestDto
type CreateServiceRequestDto = {
  description?: string;
  status?: string;
  priority?: string;
  category?: string;
  serviceCardId?: string;
  groupId?: string;
  customFieldValues?: Record<string, any>;
};

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
  // Map frontend payload to backend DTO format
  const mappedPayload: CreateServiceRequestDto = {
    serviceCardId: payload.serviceId, // Map serviceId to serviceCardId
    serviceName: payload.serviceName,
    title: payload.title,
    priority: payload.priority,
    status: payload.status || "Submitted", // Default status if not provided
    requestedBy: "Current User", // TODO: Get from auth context
    requestedDate: new Date().toISOString().split("T")[0], // Today's date
    estimatedCompletion: "", // Can be calculated based on service card
    customFieldValues: payload.customFieldValues,
    // Combine title, business justification, and additional details into description
    description: [
      payload.title,
      payload.businessJustification &&
        `Business Justification: ${payload.businessJustification}`,
      payload.requiredDate && `Required Date: ${payload.requiredDate}`,
      payload.additionalDetails &&
        `Additional Details: ${payload.additionalDetails}`,
      // Include custom field values in description for now
      payload.customFieldValues &&
        Object.keys(payload.customFieldValues).length > 0 &&
        `Custom Fields: ${JSON.stringify(payload.customFieldValues, null, 2)}`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  };

  const res = await fetchWithAuth(getBackendUrl("/api/service-requests"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mappedPayload),
  });
  if (!res.ok) throw new Error("Failed to create service request");
  return res.json();
}

// Update service request
export async function updateServiceRequest(
  id: string,
  payload: Partial<ServiceRequest>
): Promise<ApiResponse<ServiceRequest>> {
  // Filter and map payload for backend
  const mappedPayload: Partial<CreateServiceRequestDto> = {
    serviceCardId: payload.serviceId,
    priority: payload.priority,
    status: payload.status,
    // Create description from available fields
    description: [
      payload.title,
      payload.businessJustification &&
        `Business Justification: ${payload.businessJustification}`,
      payload.requiredDate && `Required Date: ${payload.requiredDate}`,
      payload.additionalDetails &&
        `Additional Details: ${payload.additionalDetails}`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  };

  const res = await fetchWithAuth(
    getBackendUrl(`/api/service-requests/${id}`),
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mappedPayload),
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
