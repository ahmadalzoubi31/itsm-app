"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User as UserIcon, Shield, Settings, UserCog } from "lucide-react";
import { FieldErrors, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";

import { upsertUserAction } from "@/app/(core)/iam/users/actions";
import {
  userSchema,
  type UserSchema,
} from "@/app/(core)/iam/users/_lib/_schemas";
import SideBarForm from "@/app/(core)/iam/users/_components/form/side-bar-form";
import UserBasicInfo from "@/app/(core)/iam/users/_components/form/tabs/user-basic-info-tab";
import UserPermissions from "@/app/(core)/iam/users/_components/form/tabs/user-permission-tab";
import UserSettings from "@/app/(core)/iam/users/_components/form/tabs/user-settings-tab";
import UserRoles from "@/app/(core)/iam/users/_components/form/tabs/user-role-tab";
import { AUTH_SOURCE, type User } from "@/app/(core)/iam/users/_lib/_types";

type UserFormProps = {
  id?: string;
  initialData?: User | null;
};

const UserForm = ({ id, initialData }: UserFormProps) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      id: id,
      username: initialData?.username ?? "",
      email: initialData?.email ?? "",
      displayName: initialData?.displayName ?? "",
      authSource: initialData?.authSource ?? AUTH_SOURCE.LOCAL,
      externalId: initialData?.externalId ?? "",
      password: "",
      isActive: initialData?.isActive ?? true,
      isLicensed: initialData?.isLicensed ?? false,
      permissions: initialData?.permissions ?? [],
      roles: initialData?.roles ?? [],
    } satisfies UserSchema,
  });

  const isLicensed = form.watch("isLicensed");

  const onSubmit = async (data: UserSchema) => {
    const promise = async () => {
      await upsertUserAction(data);
      router.push("/iam/users");
    };

    toast.promise(promise, {
      loading: id ? "Updating user..." : "Creating user...",
      success: id ? "User updated successfully" : "User created successfully",
      error: (error) => {
        console.error("Error upserting user:", error.message);
        return error.message;
      },
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList
                className={`grid w-full ${
                  isLicensed ? "grid-cols-4" : "grid-cols-2"
                }`}
              >
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
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

              <TabsContent value="basic" className="space-y-6">
                <UserBasicInfo
                  form={form as UseFormReturn<UserSchema>}
                  isEdit={!!id}
                />
              </TabsContent>

              {isLicensed && (
                <TabsContent value="roles">
                  <UserRoles form={form as UseFormReturn<UserSchema>} />
                </TabsContent>
              )}

              {isLicensed && (
                <TabsContent value="permissions">
                  <UserPermissions form={form as UseFormReturn<UserSchema>} />
                </TabsContent>
              )}

              <TabsContent value="settings">
                <UserSettings form={form as UseFormReturn<UserSchema>} />
              </TabsContent>
            </Tabs>
          </div>

          <SideBarForm
            form={form as UseFormReturn<UserSchema>}
            errors={form.formState.errors as FieldErrors<UserSchema>}
          />
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
