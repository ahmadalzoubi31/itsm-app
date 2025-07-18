"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, Crown, Mail, Tags, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { Form } from "@/components/ui/form";
import { createGroup, updateGroup } from "../services/group.service";
import { useGroup } from "../hooks/useGroup";
import { groupSchema, GroupFormData } from "../validations/group.schema";
import { GroupStatusEnum } from "../constants/group-status.constant";

import GroupBasicInfo from "./GroupBasicInfo";
import GroupLeadership from "./GroupLeadership";
import GroupContact from "./GroupContact";
import GroupAdditional from "./GroupAdditional";
import GroupSideBarForm from "./GroupSideBarForm";
import GroupPermissions from "./GroupPermissions";

interface GroupFormProps {
  isEdit?: boolean;
}

export default function GroupForm({ isEdit = false }: GroupFormProps) {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groupId = params?.id as string;
  const { group, isLoading: isLoadingGroup } = useGroup(groupId);

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      status: GroupStatusEnum.ACTIVE,
      leaderId: "",
      email: "",
      phone: "",
      location: "",
      tags: [],
      memberIds: [],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEdit && group) {
      console.log("Group data loaded:", group);
      console.log("Group type:", group.type);
      console.log("Group status:", group.status);

      const formData = {
        name: group.name,
        description: group.description || "",
        type: group.type,
        status: group.status,
        leaderId: group.leaderId || "",
        email: group.email || "",
        phone: group.phone || "",
        location: group.location || "",
        tags: group.tags || [],
        memberIds: group.members.map((m) => m.userId) || [],
      };

      console.log("Setting form data:", formData);
      form.reset(formData);

      // Force update the form values
      setTimeout(() => {
        form.setValue("type", group.type);
        form.setValue("status", group.status);
        console.log("Force set type:", group.type);
        console.log("Force set status:", group.status);
      }, 100);
    }
  }, [isEdit, group, form]);

  const createMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      toast.success("Group created successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      router.push("/groups");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create group");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GroupFormData }) =>
      updateGroup(id, data),
    onSuccess: () => {
      toast.success("Group updated successfully");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      router.push("/groups");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update group");
    },
  });

  const onSubmit = async (data: GroupFormData) => {
    setIsSubmitting(true);
    try {
      if (isEdit && groupId) {
        await updateMutation.mutateAsync({ id: groupId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      // Error handling is done in the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isLoadingGroup) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs skeleton */}
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          {/* Form content skeleton */}
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isEdit && !group) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Group not found</h3>
          <p className="text-muted-foreground">
            The group you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} key={group?.id || "new"}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="leadership"
                  className="flex items-center gap-2"
                >
                  <Crown className="h-4 w-4" />
                  Leadership
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </TabsTrigger>
                <TabsTrigger
                  value="additional"
                  className="flex items-center gap-2"
                >
                  <Tags className="h-4 w-4" />
                  Additional
                </TabsTrigger>
                <TabsTrigger
                  value="permissions"
                  className="flex items-center gap-2"
                  disabled={!isEdit || !groupId}
                >
                  <Shield className="h-4 w-4" />
                  Permissions
                </TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
                <GroupBasicInfo form={form} />
              </TabsContent>

              {/* Leadership & Status Tab */}
              <TabsContent value="leadership">
                <GroupLeadership form={form} />
              </TabsContent>

              {/* Contact Information Tab */}
              <TabsContent value="contact">
                <GroupContact form={form} />
              </TabsContent>

              {/* Additional Information Tab */}
              <TabsContent value="additional">
                <GroupAdditional form={form} />
              </TabsContent>

              {/* Permissions Tab - Only available for existing groups */}
              <TabsContent value="permissions">
                {isEdit && groupId ? (
                  <GroupPermissions
                    groupId={groupId}
                    onPermissionsChange={() => {
                      // Optionally refresh group data or show a success message
                      queryClient.invalidateQueries({
                        queryKey: ["group", groupId],
                      });
                    }}
                  />
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Save the group first to manage permissions</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <GroupSideBarForm
            form={form}
            errors={form.formState.errors}
            isEdit={isEdit}
            isSubmitting={
              isSubmitting ||
              createMutation.isPending ||
              updateMutation.isPending
            }
          />
        </div>
      </form>
    </Form>
  );
}
