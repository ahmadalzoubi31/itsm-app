// src/app/(core)/iam/groups/lib/services/group.service.ts

import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { GROUPS_ENDPOINTS } from "@/lib/api/endpoints/groups";
import type { Group } from "@/app/(core)/iam/groups/_lib/_types/group.type";
import type {
  CreateGroupDto,
  UpdateGroupDto,
} from "@/app/(core)/iam/groups/_lib/_types/group-dto.type";
import type { User } from "@/app/(core)/iam/users/_lib/_types/user.type";

// -------- Groups CRUD --------

export async function listGroups(): Promise<Group[]> {
  return fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.base));
}

export async function getGroupById(id: string): Promise<Group> {
  return fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.byId(id)));
}

export async function createGroup(dto: CreateGroupDto): Promise<Group> {
  return fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.base), {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateGroup(
  id: string,
  dto: UpdateGroupDto
): Promise<Group> {
  return fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.byId(id)), {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteGroup(id: string): Promise<{ ok: boolean }> {
  return fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.byId(id)), {
    method: "DELETE",
  });
}

// -------- Group Members Management --------

export async function addUsersToGroup(
  groupId: string,
  userIds: string[]
): Promise<User[]> {
  return fetchWithAuth(
    getBackendUrl(`${GROUPS_ENDPOINTS.byId(groupId)}/members`),
    {
      method: "POST",
      body: JSON.stringify({ userIds }),
    }
  );
}

export async function removeUsersFromGroup(
  groupId: string,
  userIds: string[]
): Promise<User[]> {
  return fetchWithAuth(
    getBackendUrl(`${GROUPS_ENDPOINTS.byId(groupId)}/members`),
    {
      method: "DELETE",
      body: JSON.stringify({ userIds }),
    }
  );
}

export async function getGroupMembers(groupId: string): Promise<User[]> {
  return fetchWithAuth(
    getBackendUrl(`${GROUPS_ENDPOINTS.byId(groupId)}/members`)
  );
}
