import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { ROLES_ENDPOINTS } from "@/constants/api-endpoints";
import { Role } from "../interfaces/role.interface";
import {
  AssignPermissionsToRoleDto,
  AssignRolesToUserDto,
  CreateRoleDto,
  RevokePermissionsFromRoleDto,
  UpdateRoleDto,
} from "../interfaces/role-dto.interface";
import { Permission } from "../../permissions/interfaces/permission.interface";

// -------- Roles CRUD --------
export async function listRoles(): Promise<Role[]> {
  return await fetchWithAuth(getBackendUrl(ROLES_ENDPOINTS.base));
}

export async function getRoleById(id: string): Promise<Role> {
  return await fetchWithAuth(getBackendUrl(ROLES_ENDPOINTS.byId(id)));
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

export async function deleteRole(id: string): Promise<{ success: boolean }> {
  return await fetchWithAuth(getBackendUrl(ROLES_ENDPOINTS.deleteRole(id)), {
    method: "DELETE",
  });
}

// -------- Role ↔ Permission --------
export async function getRolePermissions(
  roleId: string
): Promise<Permission[]> {
  return await fetchWithAuth(
    getBackendUrl(ROLES_ENDPOINTS.getRolePermissions(roleId))
  );
}

export async function assignPermissionsToRole(
  roleId: string,
  assignPermissionsToRoleDto: AssignPermissionsToRoleDto
): Promise<{ ok: boolean }> {
  return await fetchWithAuth(
    getBackendUrl(ROLES_ENDPOINTS.assignPermissionsToRole(roleId)),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignPermissionsToRoleDto),
    }
  );
}

export async function revokePermissionsFromRole(
  roleId: string,
  revokePermissionsFromRoleDto: RevokePermissionsFromRoleDto
): Promise<{ ok: boolean }> {
  return await fetchWithAuth(
    getBackendUrl(ROLES_ENDPOINTS.revokePermissionsFromRole(roleId)),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(revokePermissionsFromRoleDto),
    }
  );
}

// -------- User ↔ Role --------
export async function assignRolesToUser(
  userId: string,
  assignRolesToUserDto: AssignRolesToUserDto
): Promise<{ ok: boolean }> {
  return await fetchWithAuth(
    getBackendUrl(ROLES_ENDPOINTS.assignRolesToUser(userId)),
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
    getBackendUrl(ROLES_ENDPOINTS.revokeRoleFromUser(userId, roleId)),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
}
