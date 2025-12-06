
import { buildCookieHeader } from "@/lib/api/helper/server-cookies";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth";
import { User } from "@/app/(core)/iam/users/_lib/_types/user.type";

/**
 * Get current user from token (Server-side)
 * Uses centralized cookie building utility
 */
export async function getCurrentUserServer(): Promise<User | null> {
  try {
    const cookieHeader = await buildCookieHeader();
    const response = await fetch(getBackendUrl(AUTH_ENDPOINTS.me), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as User;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
