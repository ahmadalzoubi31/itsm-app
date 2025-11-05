"use client";

import { useState, useMemo, useEffect } from "react";
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
import {
  createRole,
  assignPermissionsToRole,
  getRolePermissions,
  getRoleById,
  updateRole,
  revokePermissionsFromRole,
} from "../../../services/role.service";
import { roleSchema } from "../../../validations/role.schema";
import { usePermissions } from "../../../../permissions/hooks/usePermissions";
import { Permission } from "@/app/(core)/iam/permissions/interfaces/permission.interface";

type RoleFormValues = z.infer<typeof roleSchema>;

const RoleForm = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { permissions, isLoading: isLoadingPermissions } = usePermissions();

  const updateSchema = roleSchema;

  const form = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      permissionIds: [],
    },
  });

  // Group permissions by category/subject for better organization
  const groupedPermissions = useMemo(() => {
    const grouped: Record<string, Permission[]> = {};
    permissions?.forEach((permission: Permission) => {
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

  const onSubmit = async (data: z.infer<typeof updateSchema>) => {
    const promise = async () => {
      try {
        // Create the role first
        const { permissionIds, key, ...roleData } = data;
        const updatedRole = await updateRole(id, roleData);

        const existingPermissions = (
          await getRolePermissions(updatedRole.id)
        ).map((p) => p.id);

        console.table({
          existingPermissions,
          permissionIds,
        });

        // check if the new ids exist in the existing permissions then skip it
        // and if the new ids not exist in the existing permissions then assign it
        // and if there is an id in the existing permissions but not in the new ids then revoke it
        // the result two arrays, 1. idsToAssigned, 2. idsToRevoked
        const idsToAssigned = permissionIds.filter(
          (id) => !existingPermissions.includes(id)
        );

        const idsToRevoked = existingPermissions.filter(
          (id) => !permissionIds.includes(id)
        );

        if (idsToAssigned.length > 0) {
          await assignPermissionsToRole(updatedRole.id, {
            permissionIds: idsToAssigned,
          });
        }
        if (idsToRevoked.length > 0) {
          await revokePermissionsFromRole(updatedRole.id, {
            permissionIds: idsToRevoked,
          });
        }
        return updatedRole;
      } catch (error) {
        throw error;
      }
    };

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        router.push("/iam/roles");
        return `Role updated successfully!`;
      },
      error: (error: any) => {
        return `Action failed: ${error.message || "Unknown error"}`;
      },
    });
  };

  // Prefill logic with useEffect
  useEffect(() => {
    setLoading(true);
    Promise.all([getRoleById(id), getRolePermissions(id)])
      .then(([role, permissions]) => {
        form.reset({
          key: role.key,
          name: role.name,
          description: role.description,
          permissionIds: permissions.map((p) => p.id),
        });
      })
      .catch((error) => {
        toast.error(`Failed to fetch role: ${error.message}`);
        router.push(`/iam/roles`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, form]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Role Information Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            {/* Key field skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-80" />
            </div>
            {/* Name field skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-64" />
            </div>
            {/* Description field skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-3 w-72" />
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  {/* Category header skeleton */}
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  {/* Permissions list skeleton */}
                  <div className="space-y-2 pl-6">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex items-start gap-3 py-1">
                        <Skeleton className="h-4 w-4 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-64" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Buttons skeleton */}
        <div className="flex justify-end gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
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
          <Button type="submit" disabled={!form.formState.isValid}>
            Update Role
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RoleForm;
