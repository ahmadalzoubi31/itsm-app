import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { AssignPermissionsToUserDto } from "../interfaces/permission-dto.interface";
import { Permission } from "../interfaces/permission.interface";

import { RevokePermissionsFromUserDto } from "../../permissions/interfaces/permission-dto.interface";
import { PERMISSIONS_ENDPOINTS } from "@/lib/api/endpoints";
import {
  AssignPermissionsToRoleDto,
  RevokePermissionsFromRoleDto,
  Role,
} from "../../roles/_lib/_types";

// -------- Permissions --------
export async function listPermissions(): Promise<Permission[]> {
  return await fetchWithAuth(getBackendUrl(PERMISSIONS_ENDPOINTS.base));
}

// -------- Role <-> Permissions --------
export async function getRolePermissions(roleId: string): Promise<Role> {
  return await fetchWithAuth(
    getBackendUrl(PERMISSIONS_ENDPOINTS.rolesGetPermissions(roleId)),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function assignPermissionsToRole(
  roleId: string,
  assignPermissionsToRoleDto: AssignPermissionsToRoleDto
): Promise<{ ok: boolean }> {
  return await fetchWithAuth(
    getBackendUrl(PERMISSIONS_ENDPOINTS.rolesAssignPermissions(roleId)),
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
    getBackendUrl(PERMISSIONS_ENDPOINTS.rolesRevokePermissions(roleId)),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(revokePermissionsFromRoleDto),
    }
  );
}

// -------- User ↔ Permission --------
export async function getUserPermissions(
  userId: string
): Promise<Permission[]> {
  return await fetchWithAuth(
    getBackendUrl(PERMISSIONS_ENDPOINTS.usersGetPermissions(userId))
  );
}
export async function assignPermissionsToUser(
  userId: string,
  assignPermissionsToUserDto: AssignPermissionsToUserDto
): Promise<{ ok: boolean }> {
  return await fetchWithAuth(
    getBackendUrl(PERMISSIONS_ENDPOINTS.usersAssignPermissions(userId)),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignPermissionsToUserDto),
    }
  );
}
export async function revokePermissionsFromUser(
  userId: string,
  revokePermissionsFromUserDto: RevokePermissionsFromUserDto
): Promise<{ ok: boolean }> {
  return await fetchWithAuth(
    getBackendUrl(PERMISSIONS_ENDPOINTS.usersRevokePermissions(userId)),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(revokePermissionsFromUserDto),
    }
  );
}
