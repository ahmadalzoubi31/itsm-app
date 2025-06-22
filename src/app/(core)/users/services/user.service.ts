import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { User } from "../types";
import { ApiResponse } from "@/types/globals";

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

// Create new user
export async function createUser(
  payload: Partial<User>
): Promise<ApiResponse<User>> {
  const res = await fetchWithAuth(getBackendUrl("/api/users"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

// Update user
export async function updateUser(
  id: string,
  payload: Partial<User>
): Promise<ApiResponse<User>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/users/${id}`), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
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
