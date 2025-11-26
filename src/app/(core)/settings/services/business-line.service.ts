import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { BUSINESS_LINE_ENDPOINTS } from "@/lib/api/endpoints/buisness-line";

export interface BusinessLine {
  id: string;
  key: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBusinessLineDto {
  key: string;
  name: string;
  description?: string;
}

export interface UpdateBusinessLineDto {
  key?: string;
  name?: string;
  description?: string;
  active?: boolean;
}

// Fetch all business lines
export async function fetchBusinessLines(): Promise<BusinessLine[]> {
  return fetchWithAuth(getBackendUrl(BUSINESS_LINE_ENDPOINTS.base));
}

// Fetch a single business line by ID
export async function fetchBusinessLineById(id: string): Promise<BusinessLine> {
  return fetchWithAuth(getBackendUrl(`${BUSINESS_LINE_ENDPOINTS.base}/${id}`), {
    credentials: "include",
  });
}

// Create a new business line
export async function createBusinessLine(
  payload: CreateBusinessLineDto
): Promise<BusinessLine> {
  return fetchWithAuth(getBackendUrl(BUSINESS_LINE_ENDPOINTS.base), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Update an existing business line
export async function updateBusinessLine(
  id: string,
  payload: UpdateBusinessLineDto
): Promise<BusinessLine> {
  return fetchWithAuth(getBackendUrl(`${BUSINESS_LINE_ENDPOINTS.base}/${id}`), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// Deactivate a business line
export async function deactivateBusinessLine(
  id: string
): Promise<BusinessLine> {
  return await fetchWithAuth(
    getBackendUrl(`${BUSINESS_LINE_ENDPOINTS.base}/${id}`),
    {
      method: "DELETE",
      credentials: "include",
    }
  );
}

// Activate a business line
export async function activateBusinessLine(id: string): Promise<BusinessLine> {
  return updateBusinessLine(id, { active: true } as any);
}
