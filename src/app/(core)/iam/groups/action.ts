"use server";

import { revalidatePath } from "next/cache";
import {
  createGroup,
  updateGroup,
  deleteGroup,
  addUsersToGroup,
  removeUsersFromGroup,
} from "@/app/(core)/iam/groups/_lib/_services/group.service";
import {
  groupSchema,
  GroupSchema,
} from "@/app/(core)/iam/groups/_lib/_schemas/group.schema";

export async function upsertGroupAction(values: GroupSchema) {
  const data = groupSchema.parse(values);

  const { id, ...payload } = data;

  let groupId = id;

  if (groupId) {
    await updateGroup(groupId, payload);
  } else {
    const newGroup = await createGroup(payload);
    groupId = newGroup.id;
  }

  revalidatePath("/iam/groups");
  return { id: groupId };
}

export async function deleteGroupAction(id: string) {
  await deleteGroup(id);
  revalidatePath("/iam/groups");
}

export async function updateGroupMembersAction(
  groupId: string,
  add: string[],
  remove: string[]
) {
  if (add.length > 0) {
    await addUsersToGroup(groupId, add);
  }
  if (remove.length > 0) {
    await removeUsersFromGroup(groupId, remove);
  }

  revalidatePath(`/iam/groups/${groupId}/edit`);
}
