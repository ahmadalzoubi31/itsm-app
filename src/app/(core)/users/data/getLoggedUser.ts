import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { cookies } from "next/headers";
import { User } from "../types/types";

export async function getLoggedUser() {
  // Call your backend using cookies for auth
  // You may want to use fetch with credentials/cookies
  const cookieStore = await cookies();
  // Prepare cookie header
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetchWithAuth(getBackendUrl("/api/auth/me"), {
    headers: {
      Cookie: cookieHeader,
    },
    // Optionally: cache: 'no-store',
    credentials: "include",
  });

  if (!res.ok) return null;
  const user = await res.json();
  return user as User;
}
