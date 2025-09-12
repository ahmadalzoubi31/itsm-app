import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { ApiResponse } from "@/types/globals";
import {
  ServiceCard,
  CreateServiceCardDto,
  ServiceCategory,
  ApprovalWorkflow,
  SLA,
  Group,
} from "../types";

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
    categoryId:
      payload.categoryId ||
      (typeof payload.category === "object" ? payload.category?.id : undefined),
    status: payload.status,
    visibility: payload.visibility,
    estimatedTime: payload.estimatedTime,
    price: payload.price,
    icon: payload.icon,
    isActive: payload.isActive,
    displayOrder: payload.displayOrder,
    tags: payload.tags,
    requestFormSchema: payload.requestFormSchema || payload.config,
    approvalWorkflowId:
      payload.approvalWorkflowId ||
      (typeof payload.approvalWorkflow === "object"
        ? payload.approvalWorkflow?.id
        : undefined),
    slaId:
      payload.slaId ||
      (typeof payload.sla === "object" ? payload.sla?.id : undefined),
    assignedGroupId:
      payload.assignedGroupId ||
      (typeof payload.assignedGroup === "object"
        ? payload.assignedGroup?.id
        : undefined),
    supportContact: payload.supportContact,
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
    categoryId:
      payload.categoryId ||
      (typeof payload.category === "object" ? payload.category?.id : undefined),
    status: payload.status,
    visibility: payload.visibility,
    estimatedTime: payload.estimatedTime,
    price: payload.price,
    icon: payload.icon,
    isActive: payload.isActive,
    displayOrder: payload.displayOrder,
    tags: payload.tags,
    requestFormSchema: payload.requestFormSchema || payload.config,
    approvalWorkflowId:
      payload.approvalWorkflowId ||
      (typeof payload.approvalWorkflow === "object"
        ? payload.approvalWorkflow?.id
        : undefined),
    slaId:
      payload.slaId ||
      (typeof payload.sla === "object" ? payload.sla?.id : undefined),
    assignedGroupId:
      payload.assignedGroupId ||
      (typeof payload.assignedGroup === "object"
        ? payload.assignedGroup?.id
        : undefined),
    supportContact: payload.supportContact,
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

// Fetch service categories
export async function fetchServiceCategories(): Promise<
  ApiResponse<ServiceCategory[]>
> {
  const res = await fetchWithAuth(getBackendUrl("/api/service-categories"), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch service categories");
  return res.json();
}

// Fetch approval workflows
export async function fetchApprovalWorkflows(): Promise<
  ApiResponse<ApprovalWorkflow[]>
> {
  const res = await fetchWithAuth(getBackendUrl("/api/approval-workflows"), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch approval workflows");
  return res.json();
}

// Fetch SLAs
export async function fetchSLAs(): Promise<ApiResponse<SLA[]>> {
  const res = await fetchWithAuth(getBackendUrl("/api/slas"), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch SLAs");
  return res.json();
}

// Fetch groups
export async function fetchGroups(): Promise<ApiResponse<Group[]>> {
  const res = await fetchWithAuth(getBackendUrl("/api/groups"), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
}
