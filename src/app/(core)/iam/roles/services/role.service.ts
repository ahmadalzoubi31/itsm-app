import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { ROLES_ENDPOINTS } from "@/constants/api-endpoints";
import { Role } from "../interfaces/role.interface";
import {
  AssignRolesToUserDto,
  CreateRoleDto,
  UpdateRoleDto,
} from "../interfaces/role-dto.interface";

// -------- Roles CRUD --------
export async function listRoles(): Promise<Role[]> {
  return await fetchWithAuth(getBackendUrl(ROLES_ENDPOINTS.base), {
    headers: { "Content-Type": "application/json" },
  });
}
export async function getRoleById(id: string): Promise<Role> {
  return await fetchWithAuth(getBackendUrl(ROLES_ENDPOINTS.byId(id)), {
    headers: { "Content-Type": "application/json" },
  });
}
export async function createRole(dto: CreateRoleDto): Promise<Role> {
  return await fetchWithAuth(getBackendUrl(ROLES_ENDPOINTS.base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}
export async function updateRole(
  id: string,
  dto: UpdateRoleDto
): Promise<Role> {
  return await fetchWithAuth(getBackendUrl(ROLES_ENDPOINTS.byId(id)), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}
export async function deleteRole(id: string): Promise<{ ok: boolean }> {
  return await fetchWithAuth(getBackendUrl(ROLES_ENDPOINTS.byId(id)), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

// -------- User ↔ Role --------
export async function assignRolesToUser(
  userId: string,
  assignRolesToUserDto: AssignRolesToUserDto
): Promise<{ ok: boolean }> {
  return await fetchWithAuth(
    getBackendUrl(ROLES_ENDPOINTS.usersAssignRoles(userId)),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignRolesToUserDto),
    }
  );
}

export async function revokeRoleFromUser(
  userId: string,
  roleId: string
): Promise<{ ok: boolean }> {
  return await fetchWithAuth(
    getBackendUrl(ROLES_ENDPOINTS.usersRevokeRole(userId, roleId)),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
}
