// src/app/(core)/approvals/services/approval.service.ts
import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";

export interface PendingApproval {
  id: string;
  requestId: string;
  request: {
    id: string;
    number: string;
    title: string;
    description?: string;
    requester?: {
      id: string;
      displayName: string;
      username: string;
    };
    createdAt: string;
  };
  status: string;
  createdAt: string;
}

export interface ApproveRequestDto {
  justification?: string;
}

export interface RejectRequestDto {
  justification: string;
}

export async function listPendingApprovals(): Promise<PendingApproval[]> {
  return fetchWithAuth(getBackendUrl("/api/v1/requests/approvals/pending"), {
    method: "GET",
  });
}

export async function approveRequest(
  requestId: string,
  dto?: ApproveRequestDto
): Promise<void> {
  await fetchWithAuth(getBackendUrl(`/api/v1/requests/${requestId}/approve`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto || {}),
  });
}

export async function rejectRequest(
  requestId: string,
  dto: RejectRequestDto
): Promise<void> {
  await fetchWithAuth(getBackendUrl(`/api/v1/requests/${requestId}/reject`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });
}
