"use client";

import React, { useState } from "react";
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
import { Shield, X, Plus, Check, ChevronDown } from "lucide-react";
import { Permission } from "../../permissions/types";
import { usePermissions } from "../../permissions/hooks/usePermissions";

const UserPermissions = ({
  selectedPermissions,
  setSelectedPermissions,
}: {
  selectedPermissions: Permission[];
  setSelectedPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
}) => {
  const { permissions: availablePermissions } = usePermissions();
  const [permissionSearch, setPermissionSearch] = useState("");
  const [permissionPopoverOpen, setPermissionPopoverOpen] = useState(false);

  const addPermission = (permission: Permission) => {
    if (!selectedPermissions.find((p) => p.id === permission.id)) {
      setSelectedPermissions((prev: Permission[]) => [...prev, permission]);
    }
  };

  const removePermission = (permissionId: string) => {
    setSelectedPermissions((prev: Permission[]) =>
      prev.filter((p: Permission) => p.id !== permissionId)
    );
  };

  const filteredPermissions = availablePermissions.filter(
    (permission) =>
      !selectedPermissions.find((p) => p.id === permission.id) &&
      (permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        permission.category
          .toLowerCase()
          .includes(permissionSearch.toLowerCase()))
  );

  const permissionsByCategory = filteredPermissions.reduce(
    (acc, permission) => {
      if (!(permission.category in acc)) {
        (acc as Record<string, Permission[]>)[permission.category] = [];
      }
      (acc as Record<string, Permission[]>)[permission.category].push(
        permission
      );
      return acc;
    },
    {}
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permission Management
        </CardTitle>
        <CardDescription>
          Assign specific permissions to control user access levels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Permissions */}
        {selectedPermissions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium">
                Assigned Permissions ({selectedPermissions.length})
              </Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPermissions.map((permission) => (
                <Badge
                  key={permission.id}
                  variant="secondary"
                  className="gap-1"
                >
                  {permission.name}
                  <button
                    type="button"
                    onClick={() => removePermission(permission.id)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Add Permissions */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add Permissions</Label>
          <Popover
            open={permissionPopoverOpen}
            onOpenChange={setPermissionPopoverOpen}
          >
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
                  placeholder="Search permissions..."
                  value={permissionSearch}
                  onValueChange={setPermissionSearch}
                />
                <CommandList>
                  <CommandEmpty>No permissions found.</CommandEmpty>
                  {Object.entries(permissionsByCategory).map(
                    ([category, permissions]) => (
                      <CommandGroup key={category} heading={category}>
                        {(permissions as Permission[]).map((permission) => (
                          <CommandItem
                            key={permission.id}
                            onSelect={() => {
                              addPermission(permission);
                              setPermissionPopoverOpen(false);
                            }}
                            className="flex flex-col items-start py-2"
                          >
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {permission.description}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )
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
