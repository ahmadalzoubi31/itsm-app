import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";
import { GROUPS_ENDPOINTS } from "@/constants/api-endpoints";
import { Group } from "../interfaces/group.interface";
import {
  CreateGroupDto,
  UpdateGroupDto,
} from "../interfaces/group-dto.interface";
import { User } from "../../users/interfaces/user.interface";

// -------- Groups CRUD --------
export async function listGroups(): Promise<Group[]> {
  return await fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.base), {
    headers: { "Content-Type": "application/json" },
  });
}
export async function getGroupById(id: string): Promise<Group> {
  return await fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.byId(id)), {
    headers: { "Content-Type": "application/json" },
  });
}
export async function createGroup(dto: CreateGroupDto): Promise<Group> {
  return await fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}
export async function updateGroup(
  id: string,
  dto: UpdateGroupDto
): Promise<Group> {
  return await fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.byId(id)), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}
export async function deleteGroup(id: string): Promise<{ ok: boolean }> {
  return await fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.byId(id)), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
}

// -------- Group Members Management --------
export async function addUsersToGroup(
  groupId: string,
  userIds: string[]
): Promise<User[]> {
  return await fetchWithAuth(
    getBackendUrl(`${GROUPS_ENDPOINTS.byId(groupId)}/members`),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds }),
    }
  );
}

export async function removeUsersFromGroup(
  groupId: string,
  userIds: string[]
): Promise<User[]> {
  return await fetchWithAuth(
    getBackendUrl(`${GROUPS_ENDPOINTS.byId(groupId)}/members`),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds }),
    }
  );
}

export async function getGroupMembers(groupId: string): Promise<User[]> {
  return await fetchWithAuth(
    getBackendUrl(`${GROUPS_ENDPOINTS.byId(groupId)}/members`),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
