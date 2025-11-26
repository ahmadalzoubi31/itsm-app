"use server";

import { cookies } from "next/headers";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth";

/**
 * Server action to handle logout
 * Reads HttpOnly refreshToken cookie server-side and calls logout endpoint
 */
export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!refreshToken) {
      return {
        ok: false,
        error: "No refresh token found",
      };
    }

    // Build cookie header to forward all cookies to backend
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(getBackendUrl(AUTH_ENDPOINTS.logout), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ refreshToken }),
    });

    // Clear cookies after successful logout
    if (response.ok) {
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
    }

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    console.error("Logout action error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Logout failed",
    };
  }
}

