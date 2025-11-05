import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { USERS_ENDPOINTS } from "@/constants/api-endpoints/users.endpoints";
import { User } from "../interfaces/user.interface";
import { CreateUserDto } from "../interfaces/user-dto.interface";
import { UpdateUserDto } from "../interfaces/user-dto.interface";

// CRUD operations for users
// Create new user
export async function createUser(dto: CreateUserDto): Promise<User> {
  return await fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

// Get all users
export async function listUsers(): Promise<User[]> {
  return await fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.base));
}

// Get user by ID
export async function getUser(id: string): Promise<User> {
  return await fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.byId(id)));
}

// Update user
export async function updateUser(id: string, dto: UpdateUserDto): Promise<User> {
  return await fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.byId(id)), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}
// Delete user
export async function deleteUser(id: string): Promise<{ id: string; deleted: boolean }> {
  return await fetchWithAuth(getBackendUrl(USERS_ENDPOINTS.byId(id)), {
    method: "DELETE",
  });
}
