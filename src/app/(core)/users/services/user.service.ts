import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { User } from "../types";
import { ApiResponse } from "@/types/globals";
import { AssignPermissionDto } from "../../permissions/types";
import { PermissionNameEnum } from "../../permissions/constants/permission-name.constant";
import { Permission } from "../../permissions/types";

// Get all users
export async function fetchUsers(): Promise<ApiResponse<User[]>> {
  const res = await fetchWithAuth(getBackendUrl("/api/users"), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Get user by ID
export async function fetchUserById(id: string): Promise<ApiResponse<User>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/users/${id}`), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

// Get user's effective permissions (direct + group inherited)
export async function fetchUserEffectivePermissions(
  userId: string
): Promise<ApiResponse<Permission[]>> {
  const res = await fetchWithAuth(
    getBackendUrl(`/api/users/${userId}/effective-permissions`),
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch user effective permissions");
  return res.json();
}

// Get user's group inherited permissions only
export async function fetchUserGroupPermissions(
  userId: string
): Promise<ApiResponse<Permission[]>> {
  const res = await fetchWithAuth(
    getBackendUrl(`/api/users/${userId}/group-permissions`),
    {
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch user group permissions");
  return res.json();
}

// Create new user
// export async function createUser(
//   payload: Partial<User>
// ): Promise<ApiResponse<User>> {
//   const res = await fetchWithAuth(getBackendUrl("/api/users"), {
//     method: "POST",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Failed to create user");
//   return res.json();
// }

// Create new user, then assign permissions if provided
export async function createUserWithPermissions(
  userPayload: Partial<User>,
  permissionNames: PermissionNameEnum[] = []
): Promise<ApiResponse<User>> {
  // 1. Create user
  const res = await fetchWithAuth(getBackendUrl("/api/users"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userPayload),
  });
  if (!res.ok) throw new Error("Failed to create user");
  const userResponse: ApiResponse<User> = await res.json();

  // 2. Assign permissions if any
  if (permissionNames.length && userResponse.data?.id) {
    const assignRes = await fetchWithAuth(
      getBackendUrl(`/api/permissions/assign`),
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userResponse.data.id,
          permissionNames,
        } as AssignPermissionDto),
      }
    );

    console.log(assignRes.ok);

    if (!assignRes.ok) throw new Error("Failed to assign permission");
    // Optionally you can return the assign result here
    // const assignResult = await assignRes.json();
  }

  // 3. Return the created user
  return userResponse;
}

// Update user
// export async function updateUser(
//   id: string,
//   payload: Partial<User>
// ): Promise<ApiResponse<User>> {
//   console.log("🚀 ~ payload:", payload);
//   const res = await fetchWithAuth(getBackendUrl(`/api/users/${id}`), {
//     method: "PUT",
//     credentials: "include",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Failed to update user");
//   return res.json();
// }

// Clear all permissions for a user
export async function clearAllUserPermissions(
  userId: string
): Promise<ApiResponse<{ message: string }>> {
  const res = await fetchWithAuth(
    getBackendUrl(`/api/permissions/clear-all/${userId}`),
    {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error("Failed to clear user permissions");
  return res.json();
}

// Update user, then assign permissions if provided
export async function updateUserWithPermissions(
  userId: string,
  userPayload: Partial<User>,
  permissionNames: PermissionNameEnum[] = []
): Promise<{ user: ApiResponse<User>; permissionAssignResult?: any }> {
  // 1. Update user
  const res = await fetchWithAuth(getBackendUrl(`/api/users/${userId}`), {
    method: "PATCH", // or "PUT" based on your API
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userPayload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update user");
  }
  const userResponse: ApiResponse<User> = await res.json();

  // 2. Assign permissions if any else clear all permissions
  let permissionAssignResult: any = undefined;
  if (permissionNames.length) {
    const assignRes = await fetchWithAuth(
      getBackendUrl(`/api/permissions/assign`),
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          permissionNames,
        } as AssignPermissionDto),
      }
    );
    permissionAssignResult = await assignRes.json().catch(() => ({}));
    if (!assignRes.ok) {
      throw new Error(
        permissionAssignResult.message ||
          "Failed to assign permission(s) to user"
      );
    }
  } else {
    // Clear all permissions instead of sending empty array
    const clearResult = await clearAllUserPermissions(userId);
    permissionAssignResult = clearResult;
  }

  // 3. Return both results
  return { user: userResponse, permissionAssignResult };
}

// Delete user
export async function deleteUser(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/users/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}
