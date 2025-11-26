import { cookies } from "next/headers";
import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth";
import { USERS_ENDPOINTS } from "@/lib/api/endpoints/users";
import type { User } from "@/app/(core)/iam/users/_lib/_types";

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

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
  const cookieHeader = await getCookieHeader();

  const response = await fetch(getBackendUrl(USERS_ENDPOINTS.base), {
    method: "GET",
    headers: {
      ...defaultHeaders,
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch users: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data as User[];
}

// Get user by ID (Server-side)
export async function getUserServer(id: string): Promise<User | null> {
  const cookieHeader = await getCookieHeader();

  const response = await fetch(getBackendUrl(USERS_ENDPOINTS.byId(id)), {
    method: "GET",
    headers: {
      ...defaultHeaders,
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch user: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data as User;
}
