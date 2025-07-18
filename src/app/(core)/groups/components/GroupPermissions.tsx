"use client";

import React, { useState, useEffect } from "react";
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
  Users,
  Info,
  Loader2,
} from "lucide-react";
import { Permission } from "../../permissions/types";
import { usePermissions } from "../../permissions/hooks/usePermissions";
import {
  fetchGroupPermissions,
  addPermissionToGroup,
  removePermissionFromGroup,
  setGroupPermissions,
} from "../services/group.service";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  groupId: string;
  onPermissionsChange?: () => void; // Callback when permissions are modified
};

const GroupPermissions = ({ groupId, onPermissionsChange }: Props) => {
  const { permissions: availablePermissions } = usePermissions();
  const [permissionSearch, setPermissionSearch] = useState("");
  const [permissionPopoverOpen, setPermissionPopoverOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [groupPermissions, setGroupPermissionsState] = useState<Permission[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch group permissions on mount and when groupId changes
  useEffect(() => {
    if (groupId) {
      fetchPermissions();
    }
  }, [groupId]);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await fetchGroupPermissions(groupId);
      setGroupPermissionsState(response.data || []);
    } catch (error) {
      console.error("Failed to fetch group permissions:", error);
      toast.error("Failed to load group permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermission = async (permission: Permission) => {
    setActionLoading(permission.id);
    try {
      await addPermissionToGroup(groupId, permission.id);
      setGroupPermissionsState((prev) => [...prev, permission]);
      toast.success(`Permission "${permission.name}" added to group`);
      setPermissionPopoverOpen(false);
      setSelectedCategory(null);
      onPermissionsChange?.();
    } catch (error: any) {
      console.error("Failed to add permission to group:", error);
      toast.error(error.message || "Failed to add permission to group");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemovePermission = async (permission: Permission) => {
    setActionLoading(permission.id);
    try {
      await removePermissionFromGroup(groupId, permission.id);
      setGroupPermissionsState((prev) =>
        prev.filter((p) => p.id !== permission.id)
      );
      toast.success(`Permission "${permission.name}" removed from group`);
      onPermissionsChange?.();
    } catch (error: any) {
      console.error("Failed to remove permission from group:", error);
      toast.error(error.message || "Failed to remove permission from group");
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearAllPermissions = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove all permissions from this group? This will affect all members who inherit these permissions."
    );

    if (!confirmed) return;

    setActionLoading("clear-all");
    try {
      await setGroupPermissions(groupId, []);
      setGroupPermissionsState([]);
      toast.success("All permissions removed from group");
      onPermissionsChange?.();
    } catch (error: any) {
      console.error("Failed to clear group permissions:", error);
      toast.error(error.message || "Failed to clear group permissions");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter available permissions (exclude already assigned)
  const filteredPermissions = availablePermissions.filter((permission) => {
    const isAssigned = groupPermissions.find((p) => p.id === permission.id);
    return (
      !isAssigned &&
      (permission.name.toLowerCase().includes(permissionSearch.toLowerCase()) ||
        permission.category
          .toLowerCase()
          .includes(permissionSearch.toLowerCase()) ||
        permission.description
          .toLowerCase()
          .includes(permissionSearch.toLowerCase()))
    );
  });

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
    handleAddPermission(permission);
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
          Group Permission Management
        </CardTitle>
        <CardDescription>
          Manage permissions that will be inherited by all members of this group
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Group Permissions */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading permissions...</span>
          </div>
        ) : (
          <>
            {groupPermissions.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <Label className="text-sm font-medium">
                      Group Permissions ({groupPermissions.length})
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            These permissions will be inherited by all group
                            members
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {groupPermissions.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={actionLoading === "clear-all"}
                      onClick={handleClearAllPermissions}
                    >
                      {actionLoading === "clear-all" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Clear All"
                      )}
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {groupPermissions.map((permission: Permission) => (
                    <Badge
                      key={permission.id}
                      variant="default"
                      className="gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {permission.name}
                      <button
                        type="button"
                        onClick={() => handleRemovePermission(permission)}
                        className="ml-1 hover:text-destructive"
                        disabled={actionLoading === permission.id}
                      >
                        {actionLoading === permission.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {groupPermissions.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No permissions assigned to this group
              </div>
            )}
          </>
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
                                disabled={actionLoading === permission.id}
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
                          No available permissions to assign.
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

export default GroupPermissions;
