"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Shield, X, Plus, ChevronDown, ChevronRight, ArrowLeft, Users, User, Info } from "lucide-react";
import { Permission } from "../../../../permissions/interfaces/permission.interface";
import { usePermissions } from "../../../../permissions/hooks/usePermissions";
import { UseFormReturn } from "react-hook-form";
// import { getUserGroupPermissions } from "../../services/user.service";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRolePermissions } from "../../../../roles/hooks/useRolePermissions";
import { Role } from "../../../../roles/interfaces/role.interface";

type Props = {
  form: UseFormReturn<any>;
  userId?: string; // For existing users to fetch group permissions
};

const UserPermissions = ({ form, userId }: Props) => {
  const { permissions: availablePermissions, isLoading: permissionsLoading } = usePermissions();
  const [permissionSearch, setPermissionSearch] = useState("");
  const [permissionPopoverOpen, setPermissionPopoverOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [groupPermissions, setGroupPermissions] = useState<Permission[]>([]);

  // Watch for role changes
  const selectedRoles: Role[] = form.watch("roles") || [];

  // Filter out end_user role to exclude its permissions
  const filteredSelectedRoles = selectedRoles.filter((role) => role.key !== "end_user");

  // Use React Query hook to fetch and cache role permissions
  const {
    permissions: rolePermissions,
    isLoading: rolePermissionsLoading,
    hasError: rolePermissionsError,
    errors: rolePermissionsErrors,
  } = useRolePermissions(filteredSelectedRoles);

  const {
    permissions: rolePermissions,
    isLoading: rolePermissionsLoading,
    hasError: rolePermissionsError,
    errors: rolePermissionsErrors,
  } = useUserPermissions();

  // Show error toast if any role permission fetch fails
  useEffect(() => {
    if (rolePermissionsError && rolePermissionsErrors.length > 0) {
      toast.error("Failed to load some role permissions");
    }
  }, [rolePermissionsError, rolePermissionsErrors]);

  // Fetch group permissions for existing users
  // useEffect(() => {
  //   if (userId) {
  //     getUserGroupPermissions(userId)
  //       .then((response) => {
  //         setGroupPermissions(response || []);
  //       })
  //       .catch((error) => {
  //         console.error("Failed to fetch group permissions:", error);
  //         toast.error("Failed to load group permissions");
  //       });
  //   }
  // }, [userId]);

  const addPermission = (permission: Permission) => {
    // Check if permission is already assigned directly or inherited from role/group
    // const directPermissions = form.getValues("permissions") || [];
    const directPermissions = 
    const isDirectlyAssigned = directPermissions.find((p: Permission) => p.id === permission.id);

    const isInheritedFromRole = rolePermissions.find((p) => p.id === permission.id);
    const isInheritedFromGroup = groupPermissions.find((p) => p.id === permission.id);

    if (isInheritedFromRole) {
      toast.warning("This permission is already inherited from a role");
      return;
    }

    if (isInheritedFromGroup) {
      toast.warning("This permission is already inherited from a group");
      return;
    }

    if (!isDirectlyAssigned) {
      form.setValue("permissions", [...directPermissions, permission]);
    }
  };

  const removePermission = (permission: Permission) => {
    // Only allow removal of direct permissions
    form.setValue(
      "permissions",
      form.getValues("permissions").filter((p: Permission) => p.id !== permission.id)
    );
  };

  // Get direct permissions from form
  const directPermissions = form.getValues("permissions") || [];

  // Filter available permissions (exclude already assigned and inherited)
  const filteredPermissions = availablePermissions.filter((permission: Permission) => {
    const isDirectlyAssigned = directPermissions.find((p: Permission) => p.id === permission.id);
    const isInheritedFromRole = rolePermissions.find((p) => p.id === permission.id);
    const isInheritedFromGroup = groupPermissions.find((p) => p.id === permission.id);

    return (
      !isDirectlyAssigned &&
      !isInheritedFromRole &&
      !isInheritedFromGroup &&
      (permission.key.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        permission.category?.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        permission.subject.toLowerCase().includes(permissionSearch.toLowerCase()))
    );
  });

  const permissionsByCategory = filteredPermissions.reduce((acc, permission) => {
    if (permission.category && !(permission.category in acc)) {
      acc[permission.category!] = [];
    }
    acc[permission.category!].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const categories = Object.keys(permissionsByCategory);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handlePermissionSelect = (permission: Permission) => {
    addPermission(permission);
    setPermissionPopoverOpen(false);
    setSelectedCategory(null);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setPermissionPopoverOpen(open);
    if (!open) {
      setSelectedCategory(null);
      setPermissionSearch("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permission Management
        </CardTitle>
        <CardDescription>
          Assign specific permissions to control user access levels. Inherited permissions come from roles and group memberships.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Direct Permissions */}
        {directPermissions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <Label className="text-sm font-medium">Direct Permissions ({directPermissions.length})</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Permissions directly assigned to this user</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-wrap gap-2">
              {directPermissions.map((permission: Permission, index: number) => (
                <Badge
                  key={permission.id || `direct-permission-${index}`}
                  variant="default"
                  className="gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {permission.key}
                  <button type="button" onClick={() => removePermission(permission)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Inherited Permissions from Roles */}
        {rolePermissions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <Label className="text-sm font-medium">Inherited from Roles ({rolePermissions.length})</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Permissions inherited from assigned roles (read-only)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-wrap gap-2">
              {rolePermissions.map((permission: Permission, index: number) => (
                <TooltipProvider key={permission.id || `role-permission-${index}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-800 cursor-help">
                        <Shield className="h-3 w-3" />
                        {permission.key}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Inherited from role assignment - manage via Roles tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        {/* Inherited Permissions from Groups */}
        {groupPermissions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium">Inherited from Groups ({groupPermissions.length})</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Permissions inherited from group memberships (read-only)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-wrap gap-2">
              {groupPermissions.map((permission: Permission, index: number) => (
                <TooltipProvider key={permission.id || `group-permission-${index}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800 cursor-help">
                        <Users className="h-3 w-3" />
                        {permission.key}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Inherited from group membership - manage via group settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        {directPermissions.length === 0 && rolePermissions.length === 0 && groupPermissions.length === 0 && (
          <div className="text-center text-muted-foreground py-4">No permissions assigned to this user</div>
        )}

        <Separator />

        {/* Add Permissions */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add Direct Permissions</Label>
          <Popover open={permissionPopoverOpen} onOpenChange={handlePopoverOpenChange}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Permission
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput
                  placeholder={selectedCategory ? `Search in ${selectedCategory}...` : "Search permissions..."}
                  value={permissionSearch}
                  onValueChange={setPermissionSearch}
                />
                <CommandList>
                  {selectedCategory ? (
                    // Show permissions for selected category
                    <>
                      <div className="px-2 py-1.5 border-b">
                        <Button variant="ghost" size="sm" onClick={handleBackToCategories} className="w-full justify-start h-auto p-1">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Categories
                        </Button>
                      </div>
                      <CommandGroup heading={selectedCategory}>
                        {permissionsByCategory[selectedCategory]?.length > 0 ? (
                          permissionsByCategory[selectedCategory].map((permission: Permission) => (
                            <CommandItem
                              key={permission.id}
                              onSelect={() => handlePermissionSelect(permission)}
                              className="flex flex-col items-start py-2"
                            >
                              <div className="font-medium">{permission.key}</div>
                              <div className="text-sm text-muted-foreground">{permission.description}</div>
                            </CommandItem>
                          ))
                        ) : (
                          <CommandEmpty>No permissions found in this category.</CommandEmpty>
                        )}
                      </CommandGroup>
                    </>
                  ) : (
                    // Show categories
                    <>
                      {categories.length > 0 ? (
                        <CommandGroup heading="Categories">
                          {categories.map((category) => (
                            <CommandItem
                              key={category}
                              onSelect={() => handleCategorySelect(category)}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex flex-col items-start">
                                <div className="font-medium">{category}</div>
                                <div className="text-sm text-muted-foreground">
                                  {permissionsByCategory[category].length} permission
                                  {permissionsByCategory[category].length !== 1 ? "s" : ""}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4" />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>
                          {permissionsLoading || rolePermissionsLoading ? "Loading permissions..." : "No available permissions to assign."}
                        </CommandEmpty>
                      )}
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPermissions;
