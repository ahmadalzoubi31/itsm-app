import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { USERS_ENDPOINTS } from "@/lib/api/endpoints/users";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
} from "@/app/(core)/iam/users/_lib/_types";

// Create new user
export async function createUser(dto: CreateUserDto): Promise<User> {
  try {
    return await fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.base), {
      method: "POST",
      body: JSON.stringify(dto),
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Get all users (client-side / React Query)
export async function listUsers(): Promise<User[]> {
  return fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.base));
}

// Get user by ID
export async function getUser(id: string): Promise<User> {
  return fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.byId(id)));
}

// Update user
export async function updateUser(
  id: string,
  dto: UpdateUserDto
): Promise<User> {
  return fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.byId(id)), {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

// Delete user
export async function deleteUser(
  id: string
): Promise<{ id: string; deleted: boolean }> {
  return fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.byId(id)), {
    method: "DELETE",
  });
}
