import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { Group, GroupMember, CreateGroupDto, UpdateGroupDto, GroupFilters } from "../types";
import { ApiResponse } from "@/types/globals";

// Get all groups
export async function fetchGroups(filters?: GroupFilters): Promise<ApiResponse<Group[]>> {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
  if (filters?.leaderId) params.append('leaderId', filters.leaderId);
  
  const url = params.toString() ? `${getBackendUrl("/api/groups")}?${params}` : getBackendUrl("/api/groups");
  
  const res = await fetchWithAuth(url, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch groups");
  return res.json();
}

// Get group by ID
export async function fetchGroupById(id: string): Promise<ApiResponse<Group>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/groups/${id}`), {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch group");
  return res.json();
}

// Create new group
export async function createGroup(
  payload: CreateGroupDto
): Promise<ApiResponse<Group>> {
  const res = await fetchWithAuth(getBackendUrl("/api/groups"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create group");
  }
  return res.json();
}

// Update group
export async function updateGroup(
  id: string,
  payload: UpdateGroupDto
): Promise<ApiResponse<Group>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/groups/${id}`), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update group");
  }
  return res.json();
}

// Delete group
export async function deleteGroup(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/groups/${id}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete group");
  }
  return res.json();
}

// Add member to group
export async function addMemberToGroup(
  groupId: string,
  userId: string,
  role: "MEMBER" | "LEADER" | "ADMIN" = "MEMBER"
): Promise<ApiResponse<GroupMember>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/groups/${groupId}/members`), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, role }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to add member to group");
  }
  return res.json();
}

// Add multiple members to group
export async function addMembersToGroup(
  groupId: string,
  userIds: string[],
  role: "MEMBER" | "LEADER" | "ADMIN" = "MEMBER"
): Promise<ApiResponse<GroupMember[]>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/groups/${groupId}/members/batch`), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userIds, role }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to add members to group");
  }
  return res.json();
}

// Remove member from group
export async function removeMemberFromGroup(
  groupId: string,
  userId: string
): Promise<ApiResponse<{ success: boolean }>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/groups/${groupId}/members/${userId}`), {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to remove member from group");
  }
  return res.json();
}

// Update member role in group
export async function updateMemberRole(
  groupId: string,
  userId: string,
  role: "MEMBER" | "LEADER" | "ADMIN"
): Promise<ApiResponse<GroupMember>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/groups/${groupId}/members/${userId}`), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update member role");
  }
  return res.json();
}

// Get group members
export async function fetchGroupMembers(groupId: string): Promise<ApiResponse<GroupMember[]>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/groups/${groupId}/members`), {
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch group members");
  }
  return res.json();
}

// Get user's groups
export async function fetchUserGroups(userId: string): Promise<ApiResponse<Group[]>> {
  const res = await fetchWithAuth(getBackendUrl(`/api/users/${userId}/groups`), {
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch user groups");
  }
  return res.json();
} 