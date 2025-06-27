"use client";

import { useState, useEffect } from "react";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Shield, Settings } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  fetchUserById,
  updateUser,
  createUserWithPermissions,
  updateUserWithPermissions,
} from "../services/user.service";
import { userSchema } from "../validations/user.schema";
import { Form } from "@/components/ui/form";
import SideBarForm from "./SideBarForm";
import { RoleEnum } from "../constants/role.constant";
import { StatusEnum } from "../constants/status.constant";
import UserBasicInfo from "./UserBasicInfo";
import UserPermissions from "./UserPermissions";
import UserSettings from "./UserSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "../hooks/useUser";

const UserForm = () => {
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(!!id); // loading only if editing
  const router = useRouter();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      role: RoleEnum.USER,
      status: StatusEnum.ACTIVE,
      permissions: [],
    },
  });

  const handleSubmit = (data: z.infer<typeof userSchema>) => {
    const promise = async () => {
      const { permissions, ...userData } = { ...data };

      // Map Permission objects to their names
      const permissionNames =
        (permissions as any[]).map((p) =>
          typeof p === "string" ? p : p.name
        ) ?? [];

      let result;
      if (id && id !== "") {
        const user = await fetchUserById(id);
        if (!user) {
          throw new Error("User not found");
        }

        userData.password = user.data.password!;

        console.log(userData);

        result = (
          await updateUserWithPermissions(id, userData, permissionNames)
        ).user;
      } else {
        result = await createUserWithPermissions(userData, permissionNames);
      }

      if (result.status === "success") {
        return result.data;
      } else {
        throw result;
      }
    };

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        router.push(`/users`);
        return `Action has been completed successfully!`;
      },
      error: (error: Response) => {
        return `Action failed, ${error.statusText}`;
      },
    });
  };

  // Prefill logic with useEffect
  useEffect(() => {
    if (id && id !== "") {
      setLoading(true);
      fetchUserById(id)
        .then((user) => {
          if (user?.data) {
            form.reset({
              firstName: user.data.firstName ?? "",
              lastName: user.data.lastName ?? "",
              username: user.data.username ?? "",
              email: user.data.email ?? "",
              password: "*********", // usually leave blank for security
              phone: user.data.phone ?? "",
              address: user.data.address ?? "",
              role: user.data.role ?? RoleEnum.USER,
              status: user.data.status ?? StatusEnum.ACTIVE,
              permissions: user.data.permissions ?? [],
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, form]);

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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Info
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
          <SideBarForm form={form} errors={form.formState.errors} />
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
