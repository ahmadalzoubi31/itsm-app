"use server";

import { cookies } from "next/headers";

export const COOKIE_NAMES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

export async function buildCookieHeader(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  } catch (error) {
    console.warn("[buildCookieHeader] Error accessing cookies:", error);
    return "";
  }
}

export async function getCookieValueServer(name: string): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value ?? null;
  } catch (error) {
    console.warn(`[getCookieValueServer] Error getting cookie \"${name}\":`, error);
    return null;
  }
}

export async function clearAuthCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
    cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
  } catch (error) {
    console.warn("[clearAuthCookies] Error clearing cookies:", error);
  }
}
