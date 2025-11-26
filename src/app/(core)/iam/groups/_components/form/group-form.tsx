"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { groupSchema, type GroupSchema } from "@/app/(core)/iam/groups/_lib/_schemas/group.schema";
import {
  getGroupById,
  getGroupMembers,
} from "@/app/(core)/iam/groups/_lib/_services/group.service";
import { upsertGroupAction, updateGroupMembersAction } from "@/app/(core)/iam/groups/action";

import { useUsers } from "@/app/(core)/iam/users/_lib/_hooks/useUsers";
import { User } from "@/app/(core)/iam/users/_lib/_types/user.type";

type GroupFormProps = {
  id?: string;
};

const GroupForm = ({ id }: GroupFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [groupMembers, setGroupMembers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"basic-info" | "members">(
    "basic-info",
  );

  const { users, isLoading: usersLoading } = useUsers();

  const form = useForm<GroupSchema>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      id,
      type: "help-desk",
      name: "",
      description: "",
      businessLineId: "",
    },
  });

  // Filter licensed users and apply search
  const filteredUsers = useMemo(() => {
    const licensedUsers = users.filter((user) => user.isLicensed);

    if (!searchQuery.trim()) {
      return licensedUsers;
    }

    const query = searchQuery.toLowerCase();
    return licensedUsers.filter(
      (user) =>
        user.displayName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query)),
    );
  }, [users, searchQuery]);

  // Prefill logic when editing
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    Promise.all([getGroupById(id), getGroupMembers(id)])
      .then(([group, members]) => {
        form.reset({
          id: group.id,
          type: group.type,
          name: group.name,
          description: group.description ?? "",
          businessLineId: group.businessLine.id,
        });

        setGroupMembers(members);
        setSelectedUserIds(members.map((m) => m.id));
      })
      .catch((error) => {
        toast.error(`Failed to fetch group: ${error.message}`);
        router.push("/iam/groups");
      })
      .finally(() => setLoading(false));
  }, [id, form, router]);

  const onSubmit = async (values: GroupSchema) => {
    const promise = async () => {
      // 1) Upsert group (create or update)
      const result = await upsertGroupAction({
        ...values,
        id, // make sure id is passed in edit mode
      });

      const groupId = result.id ?? id;
      if (!groupId) return;

      // 2) Compute members diff (add/remove)
      const currentMemberIds = groupMembers.map((m) => m.id);
      const toAdd = selectedUserIds.filter(
        (userId) => !currentMemberIds.includes(userId),
      );
      const toRemove = currentMemberIds.filter(
        (userId) => !selectedUserIds.includes(userId),
      );

      if (toAdd.length || toRemove.length) {
        await updateGroupMembersAction(groupId, toAdd, toRemove);
      }
    };

    toast.promise(promise, {
      loading: id ? "Updating group..." : "Creating group...",
      success: () => {
        queryClient.refetchQueries({ queryKey: ["groups"] });
        router.push("/iam/groups");
        return `Group ${id ? "updated" : "created"} successfully!`;
      },
      error: (error: any) => `${error || "Unknown error"}`,
    });
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  if (loading) {
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
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          {/* BASIC INFO TAB */}
          <TabsContent value="basic-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Information</CardTitle>
                <CardDescription>
                  Enter the basic information for the group
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="help-desk">Help Desk</SelectItem>
                            <SelectItem value="tier-1">Tier 1</SelectItem>
                            <SelectItem value="tier-2">Tier 2</SelectItem>
                            <SelectItem value="tier-3">Tier 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        The type of group (Help Desk, Tier 1, Tier 2, Tier 3)
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
                        The display name for the group
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
                        A brief description of what this group does
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessLineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Line</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a business line" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="550e8400-e29b-41d4-a716-446655440001">
                              IT
                            </SelectItem>
                            <SelectItem value="550e8400-e29b-41d4-a716-446655440002">
                              HR
                            </SelectItem>
                            <SelectItem value="550e8400-e29b-41d4-a716-446655440003">
                              Finance
                            </SelectItem>
                            <SelectItem value="550e8400-e29b-41d4-a716-446655440004">
                              Facilities
                            </SelectItem>
                            <SelectItem value="550e8400-e29b-41d4-a716-446655440005">
                              Legal
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Select the business line to assign to this group
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* MEMBERS TAB */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Group Members</CardTitle>
                <CardDescription>
                  Select licensed users to add to this group
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Separator />

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search users by name, username, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {usersLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="max-h-[400px] space-y-3 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">
                        {searchQuery.trim()
                          ? "No licensed users found matching your search"
                          : "No licensed users available"}
                      </p>
                    ) : (
                      <>
                        <div className="mb-2 text-xs text-muted-foreground">
                          {selectedUserIds.length} of {filteredUsers.length}{" "}
                          users selected
                        </div>
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center space-x-2 rounded-lg border border-transparent p-3 transition-colors hover:border-border hover:bg-accent"
                          >
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={selectedUserIds.includes(user.id)}
                              onCheckedChange={() => handleUserToggle(user.id)}
                            />
                            <label
                              htmlFor={`user-${user.id}`}
                              className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              <div className="flex flex-col">
                                <span>{user.displayName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {user.username}{" "}
                                  {user.email && `• ${user.email}`}
                                </span>
                              </div>
                            </label>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={() => router.push("/iam/groups")}
          >
            Cancel
          </Button>
          <Button size="sm" type="submit">
            {id ? "Update Group" : "Create Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GroupForm;
