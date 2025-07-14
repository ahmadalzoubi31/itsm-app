"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ArrowLeft, Loader2, X, Plus, Check, ChevronsUpDown } from "lucide-react";

import { createGroup, updateGroup } from "../services/group.service";
import { useGroup } from "../hooks/useGroup";
import { groupSchema, CreateGroupFormData } from "../validations/group.schema";
import { GROUP_TYPES } from "../constants/group-type.constant";
import { GROUP_STATUSES, GroupStatusEnum } from "../constants/group-status.constant";
import { useUsers } from "../../users/hooks/useUsers";
import { cn } from "@/lib/utils";

interface GroupFormProps {
  isEdit?: boolean;
}

export default function GroupForm({ isEdit = false }: GroupFormProps) {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [leaderSearchOpen, setLeaderSearchOpen] = useState(false);

  const groupId = params?.id as string;
  const { group, isLoading: isLoadingGroup } = useGroup(groupId);
  const { users, isLoading: isLoadingUsers } = useUsers();

  const form = useForm<CreateGroupFormData>({
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

  const watchedTags = form.watch("tags");
  const selectedLeaderId = form.watch("leaderId");

  // Find selected leader
  const selectedLeader = users.find(user => user.id === selectedLeaderId);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && group) {
      form.reset({
        name: group.name,
        description: group.description || "",
        type: group.type,
        status: group.status,
        leaderId: group.leaderId || "",
        email: group.email || "",
        phone: group.phone || "",
        location: group.location || "",
        tags: group.tags || [],
        memberIds: group.members.map(m => m.userId) || [],
      });
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
    mutationFn: ({ id, data }: { id: string; data: CreateGroupFormData }) =>
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

  const onSubmit = async (data: CreateGroupFormData) => {
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

  const handleAddTag = () => {
    if (tagInput.trim() && !watchedTags?.includes(tagInput.trim())) {
      const currentTags = form.getValues("tags") || [];
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (isEdit && isLoadingGroup) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isEdit && !group) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Group not found</h3>
          <p className="text-muted-foreground">The group you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>{isEdit ? "Edit Group" : "Create Group"}</CardTitle>
                <CardDescription>
                  {isEdit ? "Update group information" : "Create a new support group"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Group Name
                        <span className="text-xs text-red-500 font-medium">(required)</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Support Team Alpha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Group Type
                        <span className="text-xs text-red-500 font-medium">(required)</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GROUP_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the group's purpose and responsibilities"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Leadership & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Leadership & Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="leaderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Leader</FormLabel>
                      <Popover open={leaderSearchOpen} onOpenChange={setLeaderSearchOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={leaderSearchOpen}
                              className="w-full justify-between"
                            >
                              {selectedLeader
                                ? `${selectedLeader.fullName} (${selectedLeader.email})`
                                : "Select a leader..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search users..." />
                            <CommandList>
                              <CommandEmpty>No users found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="no-leader"
                                  onSelect={() => {
                                    form.setValue("leaderId", "");
                                    setLeaderSearchOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      !selectedLeaderId ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  No leader assigned
                                </CommandItem>
                                {isLoadingUsers ? (
                                  <CommandItem disabled>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading users...
                                  </CommandItem>
                                ) : (
                                  users.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={`${user.fullName} ${user.email}`}
                                      onSelect={() => {
                                        form.setValue("leaderId", user.id);
                                        setLeaderSearchOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          selectedLeaderId === user.id ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <div className="flex flex-col">
                                        <span >{user.fullName}</span>
                                        <span className="text-sm text-muted-foreground">{user.email}</span>
                                      </div>
                                    </CommandItem>
                                  ))
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Status
                        <span className="text-xs text-red-500 font-medium">(required)</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {GROUP_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="support@company.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Building A, Floor 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Tags</h3>
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagInputKeyDown}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddTag}
                          disabled={!tagInput.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {watchedTags && watchedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {watchedTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      Add tags to help categorize and organize this group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
              >
                {isSubmitting || createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEdit ? "Update Group" : "Create Group"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
} 