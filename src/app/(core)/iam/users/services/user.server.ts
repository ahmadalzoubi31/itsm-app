import { cookies } from "next/headers";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { AUTH_ENDPOINTS } from "@/constants/api-endpoints";
import { User } from "../interfaces/user.interface";

// Get logged-in user (SSR-safe)
export async function getLoggedUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const url = getBackendUrl(AUTH_ENDPOINTS.me);
  const res = await fetchWithAuth(url, {});
  const data = await res.json();
  return data as User;
}
