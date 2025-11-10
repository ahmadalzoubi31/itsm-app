"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { createRole, updateRole } from "../services/role.service";
import { roleSchema } from "../validations/role.schema";
import { usePermissionsHook } from "../../permissions/hooks/usePermissions.hook";
import {
  assignPermissionsToRole,
  getRolePermissions,
  revokePermissionsFromRole,
} from "../../permissions/services/permission.service";
import { useQueryClient } from "@tanstack/react-query";

type RoleFormValues = z.infer<typeof roleSchema>;

const RoleForm = ({ id }: { id: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { permissions, isLoading: isLoadingPermissions } = usePermissionsHook();
  const queryClient = useQueryClient();
  // Store the initial permission IDs when form is loaded (for edit mode)
  const initialPermissionIdsRef = useRef<string[]>([]);
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      permissionIds: [],
    },
  });

  // Prefill logic with useEffect run if id is provided and form is not loading
  useEffect(() => {
    if (id) {
      setLoading(true);
      getRolePermissions(id)
        .then((role) => {
          const initialPermissionIds = role.permissions.map((p) => p.id);
          // Store the initial permission IDs to compare later
          initialPermissionIdsRef.current = [...initialPermissionIds];
          form.reset({
            key: role.key,
            name: role.name,
            description: role.description,
            permissionIds: initialPermissionIds,
          });
          setLoading(false);
        })
        .catch((error) => {
          toast.error(`Failed to fetch role: ${error.message}`);
          router.push(`/iam/roles`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, form]);

  // Group permissions by category/subject for better organization
  const groupedPermissions = useMemo(() => {
    const grouped: Record<string, typeof permissions> = {};
    permissions.forEach((permission) => {
      const category = permission.category || permission.subject || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(permission);
    });
    return grouped;
  }, [permissions]);

  const selectedPermissionIds = form.watch("permissionIds") || [];

  const togglePermission = (permissionId: string) => {
    const currentIds = form.getValues("permissionIds") || [];
    const newIds = currentIds.includes(permissionId)
      ? currentIds.filter((id) => id !== permissionId)
      : [...currentIds, permissionId];
    form.setValue("permissionIds", newIds);
  };

  const toggleAllInCategory = (categoryPermissions: typeof permissions) => {
    const currentIds = form.getValues("permissionIds") || [];
    const categoryIds = categoryPermissions.map((p) => p.id);
    const allSelected = categoryIds.every((id) => currentIds.includes(id));

    if (allSelected) {
      // Deselect all in category
      form.setValue(
        "permissionIds",
        currentIds.filter((id) => !categoryIds.includes(id))
      );
    } else {
      // Select all in category
      const newIds = [...new Set([...currentIds, ...categoryIds])];
      form.setValue("permissionIds", newIds);
    }
  };

  const onSubmit = async (data: RoleFormValues) => {
    const promise = async () => {
      if (id) {
        const { permissionIds, key, ...roleData } = data;
        await updateRole(id, roleData);

        // this to add the new permissions to the role
        if (permissionIds && permissionIds.length > 0) {
          await assignPermissionsToRole(id, { permissionIds });
        }

        // this to remove the old permissions from the role
        // compare the initial permission IDs with the current permissionIds
        const uncheckedPermissionIds = initialPermissionIdsRef.current.filter(
          (id) => !permissionIds?.includes(id)
        );
        console.log(
          "🚀 ~ promise ~ uncheckedPermissionIds:",
          uncheckedPermissionIds
        );

        if (uncheckedPermissionIds && uncheckedPermissionIds.length > 0) {
          // revoke the unchecked permissions from the role
          await revokePermissionsFromRole(id, {
            permissionIds: uncheckedPermissionIds,
          });
        }
      } else {
        // Create the role first
        const { permissionIds, ...roleData } = data;
        const newRole = await createRole(roleData);

        // Assign permissions if any are selected
        if (permissionIds && permissionIds.length > 0) {
          await assignPermissionsToRole(newRole.id, { permissionIds });
        }
      }
    };

    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        queryClient.refetchQueries({ queryKey: ["roles"] });
        router.push(`/iam/roles`);
        return `Role ${id ? "updated" : "created"} successfully!`;
      },
      error: (error: any) => {
        return `${error || "Unknown error"}`;
      },
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs skeleton */}
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          {/* Basic Info fields */}
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          {/* Permissions tab skeleton */}
          <Skeleton className="h-20 w-full rounded-xl" />
          {/* Settings tab skeleton */}
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
            <CardDescription>
              Enter the basic information for the new role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin"
                      {...field}
                      className="font-mono"
                    />
                  </FormControl>
                  <FormDescription>
                    A unique identifier for the role (lowercase, no spaces)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Administrator" {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name for the role
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Full system access with all permissions"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of what this role does
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Select the permissions to assign to this role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            {isLoadingPermissions ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-2 pl-4">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : Object.keys(groupedPermissions).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No permissions available. Please create permissions first.
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(
                  ([category, categoryPermissions]) => {
                    const categoryIds = categoryPermissions.map((p) => p.id);
                    const allSelected = categoryIds.every((id) =>
                      selectedPermissionIds.includes(id)
                    );

                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() =>
                              toggleAllInCategory(categoryPermissions)
                            }
                            aria-label={`Select all ${category} permissions`}
                          />
                          <label
                            className="text-sm font-semibold cursor-pointer"
                            onClick={() =>
                              toggleAllInCategory(categoryPermissions)
                            }
                          >
                            {category}
                            <span className="text-muted-foreground font-normal ml-2">
                              ({categoryPermissions.length})
                            </span>
                          </label>
                        </div>
                        <div className="space-y-2 pl-6">
                          {categoryPermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-start gap-3 py-1"
                            >
                              <Checkbox
                                checked={selectedPermissionIds.includes(
                                  permission.id
                                )}
                                onCheckedChange={() =>
                                  togglePermission(permission.id)
                                }
                                aria-label={`Select permission ${permission.key}`}
                                className="mt-0.5"
                              />
                              <div className="flex-1 space-y-1">
                                <label
                                  className="text-sm font-medium cursor-pointer leading-none"
                                  onClick={() =>
                                    togglePermission(permission.id)
                                  }
                                >
                                  {permission.key}
                                </label>
                                {permission.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {permission.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                                    {permission.subject}
                                  </span>
                                  <span>•</span>
                                  <span>{permission.action}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
            {selectedPermissionIds.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {selectedPermissionIds.length} permission
                  {selectedPermissionIds.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/iam/roles")}
          >
            Cancel
          </Button>
          <Button type="submit">{id ? "Update Role" : "Create Role"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default RoleForm;
