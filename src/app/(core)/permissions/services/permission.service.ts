import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { AssignPermissionDto, Permission } from "../types";
import { ApiResponse } from "@/types/globals";

// Get all users
export async function fetchPermissions(): Promise<ApiResponse<Permission[]>> {
  const res = await fetchWithAuth(getBackendUrl("/api/permissions"), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Get user by ID
export async function fetchPermissionById(
  id: string
): Promise<ApiResponse<Permission>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/permissions/${id}`), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// Create new user
export async function createPermission(
  payload: Partial<Permission>
): Promise<ApiResponse<Permission>> {
  const res = await fetchWithAuth(getBackendUrl("/api/permissions"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

// Update user
export async function updatePermission(
  id: string,
  payload: Partial<Permission>
): Promise<ApiResponse<Permission>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/permissions/${id}`), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}

// Delete user
export async function deletePermission(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/permissions/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

export async function assignPermission(assignPermission: AssignPermissionDto) {
  return fetchWithAuth(getBackendUrl(`/api/permissions/assign`), {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(assignPermission),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to assign permission");
    return res.json();
  });
}
export async function removePermission(assignPermission: AssignPermissionDto) {
  return fetchWithAuth(getBackendUrl(`/api/permissions/un-assign`), {
    method: "DELETE",
    credentials: "include",
    body: JSON.stringify(assignPermission),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to remove permission");
    return res.json();
  });
}
