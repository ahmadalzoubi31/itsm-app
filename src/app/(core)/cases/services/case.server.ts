import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { CASES_ENDPOINTS } from "@/lib/api/endpoints/cases";
import { Case, CaseListResponse } from "../types";

// Get all cases (Server-side)
export async function listCasesServer(): Promise<Case[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(getBackendUrl(CASES_ENDPOINTS.base), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cases: ${response.statusText}`);
    }

    const data = await response.json();

    // If backend returns array directly, return it
    if (Array.isArray(data)) {
      return data as Case[];
    }

    // If backend returns paginated response, return items
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
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(getBackendUrl(CASES_ENDPOINTS.byId(id)), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch case: ${response.statusText}`);
    }

    const data = await response.json();
    return data as Case;
  } catch (error) {
    console.error("Error fetching case:", error);
    throw error;
  }
}
