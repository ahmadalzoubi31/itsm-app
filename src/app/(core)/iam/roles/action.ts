// app/(core)/iam/roles/action.ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { roleSchema, type RoleSchema } from "./_lib/_schemas/role.schema";
import {
  createRole,
  updateRole,
  deleteRole,
} from "./_lib/_services/role.service";

import {
  assignPermissionsToRole,
  revokePermissionsFromRole,
} from "../permissions/services/permission.service";
import { Permission } from "../permissions/interfaces/permission.interface";

const ROLES_PATH = "/iam/roles";

// ---- Validation ----

function validateOnServer(data: RoleSchema) {
  const parsed = roleSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid role data");
  }
  return parsed.data;
}

// ---- Actions ----

export async function upsertRoleAction(input: RoleSchema) {
  const valid = validateOnServer(input);
  const { id, permissions = [], ...roleData } = valid;

  let roleId = id;

  if (id) {
    await updateRole(id, roleData);
  } else {
    const created = await createRole(roleData);
    roleId = created.id;
  }

  if (!roleId) throw new Error("Role operation failed");

  // Assign new permissions
  if (permissions.length > 0) {
    await assignPermissionsToRole(roleId, {
      permissionIds: permissions.map((p) => p.id),
    });
  }

  revalidatePath(ROLES_PATH);
  redirect(ROLES_PATH);
}

export async function updateRolePermissionsAction(
  id: string,
  newPermissions: Permission[],
  oldPermissions: Permission[]
) {
  const toAdd = newPermissions.filter((p) => !oldPermissions.includes(p));
  const toRemove = oldPermissions.filter((p) => !newPermissions.includes(p));

  if (toAdd.length > 0) {
    await assignPermissionsToRole(id, {
      permissionIds: toAdd.map((p) => p.id),
    });
  }

  if (toRemove.length > 0) {
    await revokePermissionsFromRole(id, {
      permissionIds: toRemove.map((p) => p.id),
    });
  }

  revalidatePath(ROLES_PATH);
}

export async function deleteRoleAction(id: string) {
  await deleteRole(id);
  revalidatePath(ROLES_PATH);
}
