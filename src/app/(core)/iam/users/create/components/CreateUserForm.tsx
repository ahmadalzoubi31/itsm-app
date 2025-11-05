"use client";

import { useState } from "react";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Shield, Settings, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { FieldErrors, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createUser } from "../../services/user.service";
import { createUserSchema } from "../../validations/user.schema";
import SideBarForm from "./SideBarForm";
import UserBasicInfo from "./UserBasicInfo";
import UserPermissions from "./UserPermissions";
import UserSettings from "./UserSettings";
import UserRoles from "./UserRoles";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateUserDto } from "../../interfaces/user-dto.interface";
import { Permission } from "../../../permissions/interfaces/permission.interface";
import { AuthSource } from "../../interfaces/user.interface";
import { Role } from "../../../roles/interfaces/role.interface";
import { assignPermissionsToUser } from "../../../permissions/services/permission.service";
import { assignRolesToUser } from "../../../roles/services/role.service";
import { Form } from "@/components/ui/form";
import { AssignPermissionsToUserDto } from "../../../permissions/interfaces/permission-dto.interface";
const CreateUserForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      displayName: "",
      authSource: AuthSource.LOCAL,
      externalId: "",
      password: "",
      isActive: true,
      permissions: [] as Permission[],
      roles: [] as Role[],
    },
  });

  const handleSubmit = (dto: z.infer<typeof createUserSchema>) => {
    console.log("🚀 ~ handleSubmit ~ dto:", dto);
    const promise = async () => {
      // 1. Create the user
      const createUserDto: CreateUserDto = {
        username: dto.username,
        email: dto.email,
        displayName: dto.displayName,
        authSource: dto.authSource,
        externalId: dto.externalId,
        password: dto.password,
        isActive: dto.isActive,
      };
      const user = await createUser(createUserDto);

      // 2. Assign permissions to the user
      const permissions: AssignPermissionsToUserDto[] =
        dto.permissions?.map((permission) => ({
          permissionIds: [permission.id],
          metadata: { source: "direct" },
        })) ?? [];
      await assignPermissionsToUser(user.id, permissions);

      // 3. Assign roles to the user
      const roleIds: string[] = dto.roles?.map((role) => role.id) ?? [];
      await assignRolesToUser(user.id, { roleIds });
    };

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        router.push(`/iam/users`);
        return `User created successfully!`;
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
            errors={form.formState.errors as FieldErrors<CreateUserDto>}
          />
        </div>
      </form>
    </Form>
  );
};

export default CreateUserForm;
