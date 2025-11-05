export interface CreateRoleDto {
  key: string;
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface AssignRolesToUserDto {
  roleIds: string[];
}

export interface AssignRoleToGroupDto {
  roleId: string;
}

export interface AssignPermissionsToRoleDto {
  permissionIds: string[];
}

export interface RevokePermissionsFromRoleDto {
  permissionIds: string[];
}
