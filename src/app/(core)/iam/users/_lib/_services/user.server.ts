
import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth";
import { USERS_ENDPOINTS } from "@/lib/api/endpoints/users";
import type { User } from "@/app/(core)/iam/users/_lib/_types";

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Get logged-in user (SSR-safe)
export async function getLoggedUser(): Promise<User | null> {
  const url = getBackendUrl(AUTH_ENDPOINTS.me);
  const res = await fetchWithAuth(url, {
    headers: defaultHeaders,
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data as User;
}

// Get all users (Server-side)
export async function listUsersServer(): Promise<User[]> {
  const res = await fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.base), {
    method: "GET",
    headers: defaultHeaders,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch users: ${res.status} ${res.statusText}`
    );
  }
  const data = await res.json();
  return data as User[];
}

// Get user by ID (Server-side)
export async function getUserServer(id: string): Promise<User | null> {
  const res = await fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.byId(id)), {
    method: "GET",
    headers: defaultHeaders,
    cache: "no-store",
  });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(
      `Failed to fetch user: ${res.status} ${res.statusText}`
    );
  }
  const data = await res.json();
  return data as User;
}
