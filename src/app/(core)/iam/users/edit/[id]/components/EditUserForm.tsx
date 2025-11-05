"use client";

import { useEffect, useState } from "react";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Shield, Settings, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateUser } from "../../../services/user.service";
import { updateUserSchema } from "../../../validations/user.schema";
import SideBarForm from "./SideBarForm";
import UserBasicInfo from "./UserBasicInfo";
import UserPermissions from "./UserPermissions";
import UserSettings from "./UserSettings";
import UserRoles from "./UserRoles";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateUserDto } from "../../../interfaces/user-dto.interface";
import { Permission } from "../../../../permissions/interfaces/permission.interface";
import { Role } from "../../../../roles/interfaces/role.interface";
import { assignPermissionsToUser } from "../../../../permissions/services/permission.service";
import { assignRolesToUser } from "../../../../roles/services/role.service";
import { Form } from "@/components/ui/form";
import { useUser } from "../../../hooks/useUser";

const EditUserForm = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const { user, isLoading, error, refetch } = useUser(userId);

  // deploy th user details
  useEffect(() => {
    if (user) {
      form.setValue("email", user.email);
      form.setValue("displayName", user.displayName);
      form.setValue("isActive", user.isActive);
      form.setValue("permissions", user.userPermissions);
      form.setValue("roles", user.userRoles);
    }
  }, [user]);
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: "",
      displayName: "",
      password: "",
      isActive: true,
      permissions: [] as Permission[],
      roles: [] as Role[],
    },
  });

  const handleSubmit = (dto: z.infer<typeof updateUserSchema>) => {
    console.log("🚀 ~ handleSubmit ~ dto:", dto);
    const promise = async () => {
      // 1. Create the user
      const updateUserDto: UpdateUserDto = {
        email: dto.email,
        displayName: dto.displayName,
        password: dto.password,
        isActive: dto.isActive,
      };
      const user = await updateUser(userId, updateUserDto);

      // 2. Assign permissions to the user
      const permissionIds: string[] =
        dto.permissions?.map((permission) => permission.id) ?? [];
      await assignPermissionsToUser(user.id, { permissionIds });

      // 3. Assign roles to the user
      const roleIds: string[] = dto.roles?.map((role) => role.id) ?? [];
      await assignRolesToUser(user.id, { roleIds });
    };

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        router.push(`/iam/users`);
        return `User updated successfully!`;
      },
      error: (error: any) => {
        return `${error || "Unknown error"}`;
      },
    });
  };

  if (isLoading) {
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
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}{" "}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  Roles
                </TabsTrigger>
                <TabsTrigger
                  value="permissions"
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Permissions
                </TabsTrigger>
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
              <TabsContent value="roles">
                <UserRoles form={form} />
              </TabsContent>

              {/* Permissions Tab */}
              <TabsContent value="permissions">
                <UserPermissions form={form} />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <UserSettings form={form} />
              </TabsContent>
            </Tabs>
          </div>
          <SideBarForm
            form={form}
            errors={form.formState.errors as FieldErrors<UpdateUserDto>}
          />
        </div>
      </form>
    </Form>
  );
};

export default EditUserForm;
