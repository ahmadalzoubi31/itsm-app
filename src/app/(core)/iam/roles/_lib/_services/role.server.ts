// app/(core)/iam/roles/_lib/_services/role.server.ts


import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { ROLES_ENDPOINTS } from "@/lib/api/endpoints/roles";
import { Role } from "../_types/role.type";

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function listRolesServer(): Promise<Role[]> {
  const res = await fetchWithAuth(getBackendUrl(ROLES_ENDPOINTS.base), {
    method: "GET",
    headers: defaultHeaders,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch roles: ${res.status} ${res.statusText}`
    );
  }
  const data = await res.json();
  return data as Role[];
}

export async function getRoleServer(id: string): Promise<Role> {
  const res = await fetchWithAuth(getBackendUrl(ROLES_ENDPOINTS.byId(id)), {
    method: "GET",
    headers: defaultHeaders,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch role: ${res.status} ${res.statusText}`
    );
  }
  const data = await res.json();
  return data as Role;
}
