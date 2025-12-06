
"use server";

import { buildCookieHeader, clearAuthCookies, COOKIE_NAMES } from "@/lib/api/helper/server-cookies";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth";

/**
 * Server action to handle logout
 * Uses centralized cookie utilities
 */
export async function logoutAction() {
  try {
    const cookieHeader = await buildCookieHeader();

    const response = await fetch(getBackendUrl(AUTH_ENDPOINTS.logout), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({}),
    });

    // Clear cookies after successful logout
    if (response.ok) {
      await clearAuthCookies();
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

