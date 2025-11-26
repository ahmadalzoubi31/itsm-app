"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { userSchema, type UserSchema } from "./_lib/_schemas/user.schema";
import {
  createUser,
  updateUser,
  deleteUser,
} from "./_lib/_services/user.service";
import { assignPermissionsToUser } from "../permissions/services/permission.service";
import { assignRolesToUser } from "../roles/_lib/_services/role.service";

const USERS_PATH = "/iam/users";

// -----------------------------
// Helpers
// -----------------------------

function validateUser(input: UserSchema) {
  const parsed = userSchema.safeParse(input);

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid user data");
  }

  return parsed.data;
}

async function applyRolesAndPermissions(
  userId: string,
  roles?: { id?: string }[],
  permissions?: { id: string }[]
) {
  // --- Assign roles ----
  // Always call if roles is defined (even if empty array) to handle role removal
  if (roles !== undefined) {
    await assignRolesToUser(userId, {
      roleIds: roles
        .map((r) => r.id!)
        .filter((id): id is string => Boolean(id)),
    });
  }

  // --- Assign permissions ---
  // Always call if permissions is defined (even if empty array) to handle permission removal
  if (permissions !== undefined) {
    await assignPermissionsToUser(userId, {
      permissionIds: permissions.map((p) => p.id),
    });
  }
}

// -----------------------------
// Actions
// -----------------------------

export async function upsertUserAction(input: UserSchema) {
  const valid = validateUser(input);

  const {
    id,
    roles,
    permissions,
    authSource,
    externalId,
    username,
    password,
    ...rest
  } = valid;

  // ❗ Normalize email (backend does not accept null)
  const basePayload = {
    ...rest,
    email: rest.email ?? undefined,
  };

  let userId = id;

  if (id) {
    // --- Update existing user ---
    // Backend UpdateUserDto does NOT allow username
    // Password should only be sent if it has a value
    const updatePayload = {
      ...basePayload,
      ...(password ? { password } : {}),
    };
    await updateUser(id, updatePayload);
  } else {
    // --- Create new user ---
    const createPayload = {
      ...basePayload,
      username,
      password, // Password is required for new local users (validated by schema)
      authSource,
      externalId,
    };

    const created = await createUser(createPayload);

    userId = created.id;
  }

  // --- Assign roles + permissions ---
  if (userId) {
    await applyRolesAndPermissions(userId, roles, permissions);
  }

  revalidatePath(USERS_PATH);
}

export async function deleteUserAction(id: string) {
  await deleteUser(id);
  revalidatePath(USERS_PATH);
}
