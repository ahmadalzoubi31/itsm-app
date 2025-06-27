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
import {
  Shield,
  X,
  Plus,
  Check,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Permission } from "../../permissions/types";
import { usePermissions } from "../../permissions/hooks/usePermissions";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
};

const UserPermissions = ({ form }: Props) => {
  const { permissions: availablePermissions } = usePermissions();
  const [permissionSearch, setPermissionSearch] = useState("");
  const [permissionPopoverOpen, setPermissionPopoverOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addPermission = (permission: Permission) => {
    if (
      !form
        .getValues("permissions")
        .find((p: Permission) => p.id === permission.id)
    ) {
      form.setValue("permissions", [
        ...form.getValues("permissions"),
        permission,
      ]);
    }
  };

  const removePermission = (permission: Permission) => {
    form.setValue(
      "permissions",
      form.getValues("permissions").filter((p: Permission) => p !== permission)
    );
  };

  const filteredPermissions = availablePermissions.filter(
    (permission) =>
      !form
        .getValues("permissions")
        .find((p: Permission) => p.id === permission.id) &&
      (permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        permission.category
          .toLowerCase()
          .includes(permissionSearch.toLowerCase()) ||
        permission.description
          .toLowerCase()
          .includes(permissionSearch.toLowerCase()))
  );

  const permissionsByCategory = filteredPermissions.reduce(
    (acc, permission) => {
      if (!(permission.category in acc)) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

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
          Assign specific permissions to control user access levels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Permissions */}
        {form.getValues("permissions").length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium">
                Assigned Permissions ({form.getValues("permissions").length})
              </Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.getValues("permissions").map((permission: Permission) => (
                <Badge
                  key={permission.name}
                  variant="secondary"
                  className="gap-1"
                >
                  {permission.name}
                  <button
                    type="button"
                    onClick={() => removePermission(permission)}
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
            onOpenChange={handlePopoverOpenChange}
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
                  placeholder={
                    selectedCategory
                      ? `Search in ${selectedCategory}...`
                      : "Search permissions..."
                  }
                  value={permissionSearch}
                  onValueChange={setPermissionSearch}
                />
                <CommandList>
                  {selectedCategory ? (
                    // Show permissions for selected category
                    <>
                      <div className="px-2 py-1.5 border-b">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBackToCategories}
                          className="w-full justify-start h-auto p-1"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to Categories
                        </Button>
                      </div>
                      <CommandGroup heading={selectedCategory}>
                        {permissionsByCategory[selectedCategory]?.length > 0 ? (
                          permissionsByCategory[selectedCategory].map(
                            (permission) => (
                              <CommandItem
                                key={permission.id}
                                onSelect={() =>
                                  handlePermissionSelect(permission)
                                }
                                className="flex flex-col items-start py-2"
                              >
                                <div className="font-medium">
                                  {permission.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {permission.description}
                                </div>
                              </CommandItem>
                            )
                          )
                        ) : (
                          <CommandEmpty>
                            No permissions found in this category.
                          </CommandEmpty>
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
                                  {permissionsByCategory[category].length}{" "}
                                  permission
                                  {permissionsByCategory[category].length !== 1
                                    ? "s"
                                    : ""}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4" />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ) : (
                        <CommandEmpty>
                          No permission categories found.
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
