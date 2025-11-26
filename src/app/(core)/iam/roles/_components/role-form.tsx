// app/(core)/iam/roles/_components/role-form.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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

import { roleSchema, type RoleSchema } from "../_lib/_schemas/role.schema";
import {
  createRole,
  updateRole,
  getRoleById,
} from "../_lib/_services/role.service";
import { usePermissionsHook } from "../../permissions/hooks/usePermissions.hook";
import {
  assignPermissionsToRole,
  getRolePermissions,
  revokePermissionsFromRole,
} from "../../permissions/services/permission.service";
import { Role } from "../_lib/_types";
import router from "next/router";

type RoleFormProps = {
  id?: string;
  initialData?: Role | null;
};

const RoleForm = ({ id, initialData }: RoleFormProps) => {
  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      id: initialData?.id ?? "",
      key: initialData?.key ?? "",
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      permissions: initialData?.permissions ?? [],
    } satisfies RoleSchema,
  });

  const queryClient = useQueryClient();

  const { permissions, isLoading: isLoadingPermissions } = usePermissionsHook();

  const initialPermissionIds = useMemo(() => {
    return initialData?.permissions?.map((p) => p.id) ?? [];
  }, [initialData]);

  // Group permissions by category/subject
  const groupedPermissions = useMemo(() => {
    const grouped: Record<string, typeof permissions> = {};

    permissions.forEach((permission) => {
      const category = permission.category || permission.subject || "Other";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(permission);
    });

    return grouped;
  }, [permissions]);

  const selectedPermissions = form.watch("permissions") ?? [];
  const selectedPermissionIds = selectedPermissions.map((p) => p.id);

  const togglePermission = (permissionId: string) => {
    const currentPermissions = form.getValues("permissions") ?? [];
    const isSelected = currentPermissions.some((p) => p.id === permissionId);

    if (isSelected) {
      form.setValue(
        "permissions",
        currentPermissions.filter((p) => p.id !== permissionId)
      );
    } else {
      const permissionToAdd = permissions.find((p) => p.id === permissionId);
      if (permissionToAdd) {
        form.setValue("permissions", [...currentPermissions, permissionToAdd]);
      }
    }
  };

  const toggleAllInCategory = (categoryPermissions: typeof permissions) => {
    const currentPermissions = form.getValues("permissions") ?? [];
    const categoryIds = categoryPermissions.map((p) => p.id);
    const allSelected = categoryIds.every((id) =>
      currentPermissions.some((p) => p.id === id)
    );

    if (allSelected) {
      form.setValue(
        "permissions",
        currentPermissions.filter((p) => !categoryIds.includes(p.id))
      );
    } else {
      const permissionsToAdd = categoryPermissions.filter(
        (p) => !currentPermissions.some((cp) => cp.id === p.id)
      );
      form.setValue("permissions", [
        ...currentPermissions,
        ...permissionsToAdd,
      ]);
    }
  };

  const onSubmit = async (values: RoleSchema) => {
    const promise = async () => {
      const {
        id: _id,
        permissions: selectedPermissions,
        key,
        ...roleDataWithoutKeyAndPerms
      } = values;

      const permissionIds = selectedPermissions.map((p) => p.id);

      if (id) {
        // update role (do not allow key change from here)
        await updateRole(id, roleDataWithoutKeyAndPerms);

        if (permissionIds.length > 0) {
          await assignPermissionsToRole(id, {
            permissions: permissionIds,
          });
        }

        const uncheckedPermissionIds = initialPermissionIds.filter(
          (permId) => !permissionIds.includes(permId)
        );

        if (uncheckedPermissionIds.length > 0) {
          await revokePermissionsFromRole(id, {
            permissionIds: uncheckedPermissionIds,
          });
        }
      } else {
        // create role
        const {
          permissions: _perms,
          id: _ignoredId,
          ...createPayload
        } = values;

        const newRole = await createRole(createPayload);

        if (permissionIds && permissionIds.length > 0) {
          await assignPermissionsToRole(newRole.id, { permissionIds });
        }
      }
    };

    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        queryClient.refetchQueries({ queryKey: ["roles"] });
        router.push("/iam/roles");
        return `Role ${id ? "updated" : "created"} successfully!`;
      },
      error: (error: any) => `${error ?? "Unknown error"}`,
    });
  };

  if (form.formState.isSubmitting) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-3">
          <div className="mb-4 flex gap-4">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
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
              Enter the basic information for the role
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
                    const allSelected = categoryIds.every((permId) =>
                      selectedPermissionIds.includes(permId)
                    );

                    return (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2 border-b pb-2">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={() =>
                              toggleAllInCategory(categoryPermissions)
                            }
                            aria-label={`Select all ${category} permissions`}
                          />
                          <label
                            className="cursor-pointer text-sm font-semibold"
                            onClick={() =>
                              toggleAllInCategory(categoryPermissions)
                            }
                          >
                            {category}
                            <span className="ml-2 font-normal text-muted-foreground">
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
                                  className="cursor-pointer text-sm font-medium leading-none"
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
                                  <span className="rounded bg-muted px-1.5 py-0.5 font-mono">
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
              <div className="border-t pt-4">
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
            size="sm"
            type="button"
            variant="outline"
            onClick={() => router.push("/iam/roles")}
          >
            Cancel
          </Button>
          <Button size="sm" type="submit">
            {id ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RoleForm;
