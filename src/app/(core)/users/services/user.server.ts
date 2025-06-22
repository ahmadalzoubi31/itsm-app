import { cookies } from "next/headers";
import { LoggedUser } from "../types";
import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";

// Get logged-in user (SSR-safe)
export async function getLoggedUser(): Promise<LoggedUser | null> {
  const cookieStore = cookies();
  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetchWithAuth(getBackendUrl("/api/auth/me"), {
    headers: { Cookie: cookieHeader },
    credentials: "include",
  });

  if (!res.ok) return null;
  const { data } = await res.json();
  return data as LoggedUser;
}
