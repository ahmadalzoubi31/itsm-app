import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth";
import { User } from "@/app/(core)/iam/users/_lib/_types/user.type";

/**
 * Get current user from token (Server-side)
 */
export async function getCurrentUserServer(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

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
