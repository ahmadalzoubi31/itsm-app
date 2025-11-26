// app/(core)/iam/roles/_lib/_types/role-dto.type.ts

export type CreateRoleDto = {
  key: string;
  name: string;
  description?: string;
};

// If you don't want key to be updatable from the UI, we omit it here.
// If you *do* want to allow updating key, just use: Partial<CreateRoleDto>
export type UpdateRoleDto = Partial<Omit<CreateRoleDto, "key">>;

export type AssignRolesToUserDto = {
  roleIds: string[];
};

export type AssignRoleToGroupDto = {
  roleId: string;
};

export type AssignPermissionsToRoleDto = {
  permissionIds: string[];
};

export type RevokePermissionsFromRoleDto = {
  permissionIds: string[];
};
