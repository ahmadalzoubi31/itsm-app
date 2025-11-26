"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Shield,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  User,
  Info,
} from "lucide-react";

import { toast } from "sonner";

import { Permission } from "@/app/(core)/iam/permissions/interfaces/permission.interface";
import { Role } from "@/app/(core)/iam/roles/_lib/_types/role.type";

import { usePermissionsHook } from "@/app/(core)/iam/permissions/hooks/usePermissions.hook";
import { useRolePermissions } from "@/app/(core)/iam/roles/_lib/_hooks/useRolePermissions";
import { UseFormReturn } from "react-hook-form";
import type { UserSchema } from "@/app/(core)/iam/users/_lib/_schemas";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserPermissionsProps {
  form: UseFormReturn<UserSchema>;
}

const UserPermissions = ({ form }: UserPermissionsProps) => {
  const selectedRoles = form.watch("roles") ?? [];

  const { rolePermissions, error: rolePermissionsError } = useRolePermissions(
    selectedRoles as Role[]
  );

  const { permissions, isLoading } = usePermissionsHook();

  const [search, setSearch] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const directPermissions = form.watch("permissions") ?? [];

  // Inherited permissions (from roles)
  const inheritedPermissions = useMemo(() => {
    if (!rolePermissions) return [];
    return Array.from(new Map(rolePermissions.map((p) => [p.id, p])).values());
  }, [rolePermissions]);

  useEffect(() => {
    if (rolePermissionsError) {
      toast.error("Failed to load role permissions");
    }
  }, [rolePermissionsError]);

  const addPermission = (permission: Permission) => {
    if (inheritedPermissions.some((p) => p.id === permission.id)) {
      toast.warning("Permission inherited from a role");
      return;
    }

    if (directPermissions.some((p) => p.id === permission.id)) return;

    const newList = [...directPermissions, permission];
    form.setValue("permissions", newList);
  };

  const removePermission = (permission: Permission) => {
    const newList = directPermissions.filter((p) => p.id !== permission.id);
    form.setValue("permissions", newList);
  };

  // Filter available permissions
  const availablePermissions = useMemo(() => {
    const lower = search.toLowerCase();

    return permissions.filter((p) => {
      const isAssigned =
        directPermissions.some((dp) => dp.id === p.id) ||
        inheritedPermissions.some((ip) => ip.id === p.id);

      if (isAssigned) return false;

      return (
        p.key.toLowerCase().includes(lower) ||
        p.category?.toLowerCase().includes(lower) ||
        p.subject.toLowerCase().includes(lower)
      );
    });
  }, [permissions, search, directPermissions, inheritedPermissions]);

  // Group by category
  const permissionsByCategory = useMemo(() => {
    return availablePermissions.reduce((acc, p) => {
      const cat = p.category ?? "Uncategorized";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    }, {} as Record<string, Permission[]>);
  }, [availablePermissions]);

  const categories = Object.keys(permissionsByCategory);

  // UI
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permission Management
        </CardTitle>
        <CardDescription>
          Assign or remove direct permissions. Inherited permissions come from
          roles.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Direct Permissions */}
        {directPermissions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <Label className="text-sm font-medium">
                Direct Permissions ({directPermissions.length})
              </Label>
            </div>

            <div className="flex flex-wrap gap-2">
              {directPermissions.map((permission) => (
                <Badge
                  key={permission.id}
                  className="gap-1 bg-blue-100 text-blue-800"
                >
                  {permission.key}
                  <button
                    className="p-0 ml-1 hover:text-destructive hover:cursor-pointer"
                    onClick={() => removePermission(permission as Permission)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Inherited */}
        {inheritedPermissions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-700" />
              <Label className="text-sm font-medium">
                Inherited from Roles ({inheritedPermissions.length})
              </Label>
            </div>

            <div className="flex flex-wrap gap-2">
              {inheritedPermissions.map((permission) => (
                <TooltipProvider key={permission.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="gap-1 bg-purple-100 text-purple-800">
                        {permission.key}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Managed via Roles tab</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}

        {directPermissions.length === 0 &&
          inheritedPermissions.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No permissions assigned
            </div>
          )}

        <Separator />

        {/* Add Permission */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add Direct Permission</Label>

          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-between"
              >
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
                  placeholder={
                    selectedCategory
                      ? `Search in ${selectedCategory}...`
                      : "Search permissions..."
                  }
                  value={search}
                  onValueChange={setSearch}
                />

                <CommandList>
                  {/* Category view */}
                  {!selectedCategory && (
                    <>
                      {categories.length > 0 ? (
                        <CommandGroup heading="Categories">
                          {categories.map((category) => (
                            <CommandItem
                              key={category}
                              onSelect={() => setSelectedCategory(category)}
                              className="flex items-center justify-between py-2"
                            >
                              <div>
                                <div className="font-medium">{category}</div>
                                <div className="text-xs text-muted-foreground">
                                  {permissionsByCategory[category].length} perms
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4" />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>
                          {isLoading
                            ? "Loading..."
                            : "No available permissions"}
                        </CommandEmpty>
                      )}
                    </>
                  )}

                  {/* Permissions in category */}
                  {selectedCategory && (
                    <>
                      <div className="border-b px-2 py-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedCategory(null)}
                          className="flex items-center gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Categories
                        </Button>
                      </div>

                      <CommandGroup heading={selectedCategory}>
                        {permissionsByCategory[selectedCategory]?.map(
                          (permission) => (
                            <CommandItem
                              key={permission.id}
                              onSelect={() => {
                                addPermission(permission);
                                setPopoverOpen(false);
                                setSelectedCategory(null);
                              }}
                              className="flex flex-col items-start py-2"
                            >
                              <span className="font-medium">
                                {permission.key}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {permission.description}
                              </span>
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
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
