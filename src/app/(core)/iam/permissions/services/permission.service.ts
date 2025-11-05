import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { PERMISSIONS_ENDPOINTS } from "@/constants/api-endpoints";
import { AssignPermissionsToUserDto } from "../interfaces/permission-dto.interface";
import { Permission } from "../interfaces/permission.interface";

// -------- Permissions --------
export async function listPermissions(): Promise<Permission[]> {
  return fetchWithAuth(getBackendUrl(PERMISSIONS_ENDPOINTS.base));
}

// -------- User Permissions --------
export async function getUserPermissions(
  userId: string
): Promise<Permission[]> {
  return await fetchWithAuth(
    getBackendUrl(PERMISSIONS_ENDPOINTS.getUserPermissions(userId))
  );
}

export async function assignPermissionsToUser(
  userId: string,
  assignPermissionsToUserDto: AssignPermissionsToUserDto[]
): Promise<{ ok: boolean }> {
  return await fetchWithAuth(
    getBackendUrl(PERMISSIONS_ENDPOINTS.assignPermissionsToUser(userId)),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignPermissionsToUserDto),
    }
  );
}

export async function revokePermissionFromUser(
  userId: string,
  permissionId: string
): Promise<{ ok: boolean }> {
  return await fetchWithAuth(
    getBackendUrl(
      PERMISSIONS_ENDPOINTS.revokePermissionFromUser(userId, permissionId)
    ),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
  );
}
