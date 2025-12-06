
import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { CASES_ENDPOINTS } from "@/lib/api/endpoints/cases";
import { Case, CaseListResponse } from "../types";

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Get all cases (Server-side)
export async function listCasesServer(): Promise<Case[]> {
  try {
    const res = await fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.base), {
      method: "GET",
      headers: defaultHeaders,
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch cases: ${res.statusText}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return data as Case[];
    }
    if (data.items && Array.isArray(data.items)) {
      return data.items as Case[];
    }
    return data as Case[];
  } catch (error) {
    console.error("Error fetching cases:", error);
    throw error;
  }
}

// Get case by ID (Server-side)
export async function getCaseServer(id: string): Promise<Case | null> {
  try {
    const res = await fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.byId(id)), {
      method: "GET",
      headers: defaultHeaders,
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch case: ${res.statusText}`);
    }
    const data = await res.json();
    return data as Case;
  } catch (error) {
    console.error("Error fetching case:", error);
    throw error;
  }
}
