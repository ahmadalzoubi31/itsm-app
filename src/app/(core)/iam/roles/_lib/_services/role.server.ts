// app/(core)/iam/roles/_lib/_services/role.server.ts

import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { ROLES_ENDPOINTS } from "@/lib/api/endpoints/roles";
import { Role } from "../_types/role.type";
import { cookies } from "next/headers";

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

export async function listRolesServer(): Promise<Role[]> {
  const cookieHeader = await getCookieHeader();

  const response = await fetch(getBackendUrl(ROLES_ENDPOINTS.base), {
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
  return data as Role[];
}

export async function getRoleServer(id: string): Promise<Role> {
  const cookieHeader = await getCookieHeader();

  const response = await fetch(getBackendUrl(ROLES_ENDPOINTS.byId(id)), {
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
  return data as Role;
}
