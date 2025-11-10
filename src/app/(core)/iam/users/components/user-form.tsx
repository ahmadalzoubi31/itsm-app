"use client";

import { useEffect, useRef, useState } from "react";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Shield, Settings, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUser, getUser, updateUser } from "../services/user.service";
import { userSchema } from "../validations/user.schema";
import SideBarForm from "./side-bar-form";
import UserBasicInfo from "./user-basic-info-tab";
import UserPermissions from "./user-permission-tab";
import UserSettings from "./user-settings-tab";
import UserRoles from "./user-role-tab";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateUserDto } from "../interfaces/user-dto.interface";
import { AuthSource } from "../interfaces/user.interface";
import {
  assignPermissionsToUser,
  revokePermissionsFromUser,
} from "../../permissions/services/permission.service";
import { assignRolesToUser } from "../../roles/services/role.service";
import { Permission } from "../../permissions/interfaces/permission.interface";
import { Role } from "../../roles/interfaces/role.interface";
import { Form } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";

type UserFormValues = z.infer<typeof userSchema>;

const UserForm = ({ id }: { id: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const initialPermissionsRef = useRef<Permission[]>([]);
  const queryClient = useQueryClient();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      displayName: "",
      authSource: AuthSource.LOCAL,
      externalId: "",
      password: "",
      isActive: true,
      isLicensed: false,
      permissions: [] as Permission[],
      roles: [] as Role[],
    },
  });

  // Watch the isLicensed field
  const isLicensed = form.watch("isLicensed");

  // Prefill logic with useEffect run if id is provided and form is not loading
  useEffect(() => {
    if (id) {
      setLoading(true);
      getUser(id)
        .then((user) => {
          form.reset({
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            authSource: user.authSource,
            externalId: user.externalId,
            password: user.password,
            isActive: user.isActive,
            isLicensed: user.isLicensed,
            permissions: user.permissions,
            roles: user.roles,
          });
          setLoading(false);
        })
        .catch((error) => {
          toast.error(`Failed to fetch user: ${error.message}`);
          router.push(`/iam/users`);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, form]);

  const onSubmit = async (data: UserFormValues) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    const promise = async () => {
      if (id) {
        const {
          permissions,
          roles,
          username,
          authSource,
          externalId,
          ...userData
        } = data;
        await updateUser(id, userData);

        // this to add the new roles to the user
        if (roles && roles.length > 0) {
          await assignRolesToUser(id, {
            roleIds: roles.map((role) => role.id) as string[],
          });
        }

        // this to add the new permissions to the user
        if (permissions && permissions.length > 0) {
          await assignPermissionsToUser(id, {
            permissionIds: permissions.map((permission) => permission.id),
          });
        }

        // this to remove the old permissions from the role
        // compare the initial permission IDs with the current permissionIds
        const uncheckedPermissionIds = initialPermissionsRef.current.filter(
          (permission) => !permissions?.includes(permission)
        );

        if (uncheckedPermissionIds && uncheckedPermissionIds.length > 0) {
          // revoke the unchecked permissions from the user
          await revokePermissionsFromUser(id, {
            permissionIds: uncheckedPermissionIds.map(
              (permission) => permission.id
            ),
          });
        }
      } else {
        // Create the user first
        const { permissions, roles, ...userData } = data;
        const newUser = await createUser(userData);

        // prevent the user from being assigned role and permissions if the account is not licensed
        if (!isLicensed) {
          return;
        }

        // this to add the new roles to the user
        if (roles && roles.length > 0) {
          await assignRolesToUser(newUser.id, {
            roleIds: roles.map((role) => role.id) as string[],
          });
        }

        // this to add the new permissions to the user
        if (permissions && permissions.length > 0) {
          await assignPermissionsToUser(newUser.id, {
            permissionIds: permissions.map((permission) => permission.id),
          });
        }
      }
    };

    toast.promise(promise, {
      loading: "Loading...",
      success: () => {
        queryClient.refetchQueries({ queryKey: ["users"] });
        router.push(`/iam/users`);
        return `User ${id ? "updated" : "created"} successfully!`;
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}{" "}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList
                className={`grid w-full ${
                  isLicensed ? "grid-cols-4" : "grid-cols-2"
                }`}
              >
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                {isLicensed && (
                  <TabsTrigger
                    value="roles"
                    className="flex items-center gap-2"
                  >
                    <UserCog className="h-4 w-4" />
                    Roles
                  </TabsTrigger>
                )}
                {isLicensed && (
                  <TabsTrigger
                    value="permissions"
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Permissions
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <UserBasicInfo form={form} />
              </TabsContent>

              {/* Roles Tab */}
              {isLicensed && (
                <TabsContent value="roles">
                  <UserRoles form={form} />
                </TabsContent>
              )}

              {/* Permissions Tab */}
              {isLicensed && (
                <TabsContent value="permissions">
                  <UserPermissions form={form} />
                </TabsContent>
              )}

              {/* Settings Tab */}
              <TabsContent value="settings">
                <UserSettings form={form} />
              </TabsContent>
            </Tabs>
          </div>
          <SideBarForm
            form={form}
            errors={form.formState.errors as FieldErrors<CreateUserDto>}
          />
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
