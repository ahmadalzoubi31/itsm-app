"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  createCaseSchema,
  updateCaseSchema,
  CreateCaseFormData,
  UpdateCaseFormData,
} from "../validations/case.schema";
import {
  createCase,
  updateCase,
  fetchCaseById,
  fetchCaseCategories,
  fetchCaseSubcategories,
} from "../services/case.service";
import { fetchBusinessLines } from "@/app/(core)/settings/services/business-line.service";
import { listServices } from "@/app/(core)/catalog/admin/services/_lib/_services/service.service";
import { useUsers } from "@/app/(core)/iam/users/_lib/_hooks/useUsers";
import { useGroupsHook } from "@/app/(core)/iam/groups/_lib/_hooks/useGroups";
import { getGroupMembers } from "@/app/(core)/iam/groups/_lib/_services/group.service";
import { getUser } from "@/app/(core)/iam/users/_lib/_services/user.service";
import { useQueryClient, useQuery, useQueries } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CasePriority, CaseStatus, CASE_STATUS_OPTIONS } from "../types";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  MapPin,
  User as UserIcon,
} from "lucide-react";

interface CaseFormProps {
  id?: string;
}

export function CaseForm({ id }: CaseFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [businessLines, setBusinessLines] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [caseData, setCaseData] = useState<any>(null);
  const { users, isLoading: usersLoading } = useUsers();
  const { groups, isLoading: groupsLoading } = useGroupsHook();
  const isEditMode = !!id;

  const form = useForm<CreateCaseFormData | UpdateCaseFormData>({
    resolver: zodResolver(
      (isEditMode ? updateCaseSchema : createCaseSchema) as z.ZodTypeAny
    ),
    defaultValues: {
      title: "",
      description: "",
      priority: CasePriority.MEDIUM,
      status: undefined, // Only available in edit mode
      requesterId: "",
      assigneeId: "",
      assignmentGroupId: "",
      businessLineId: "",
      categoryId: "",
      subcategoryId: "",
      affectedServiceId: "",
      requestCardId: "",
    },
  });

  const selectedGroupId = form.watch("assignmentGroupId");
  const selectedRequesterId = form.watch("requesterId");
  const selectedCategoryId = form.watch("categoryId");

  // Fetch requester details when a requester is selected
  const { data: requesterDetails, isLoading: requesterLoading } = useQuery({
    queryKey: ["user", selectedRequesterId],
    queryFn: () => getUser(selectedRequesterId as string),
    enabled: !!selectedRequesterId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Filter groups to exclude hidden ones (groups starting with "Hide")
  const visibleGroups = groups.filter(
    (group) => !group.name.toLowerCase().startsWith("hide")
  );

  // Fetch members for all visible groups to check which ones have members
  const groupMembersQueries = useQueries({
    queries: visibleGroups.map((group) => ({
      queryKey: ["group-members-check", group.id],
      queryFn: () => getGroupMembers(group.id),
      enabled: true,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    })),
  });

  // Filter out groups that have no members
  const groupsWithMembers = visibleGroups.filter((group, index) => {
    const membersQuery = groupMembersQueries[index];
    return membersQuery?.data && membersQuery.data.length > 0;
  });

  // Fetch group members when assignment group is selected
  const { data: groupMembers = [], isLoading: groupMembersLoading } = useQuery({
    queryKey: ["group-members", selectedGroupId],
    queryFn: () => getGroupMembers(selectedGroupId as string),
    enabled: !!selectedGroupId,
  });

  // Filter users for assignee dropdown - only show users from selected group
  const availableAssignees = selectedGroupId
    ? groupMembers.filter((user) => user.id)
    : [];

  // Watch for assignment group changes and clear assignee if not in new group
  useEffect(() => {
    if (selectedGroupId) {
      // Only clear assignee if group members have loaded and assignee is not in the group
      if (!groupMembersLoading) {
        const currentAssigneeId = form.getValues("assigneeId");
        if (
          currentAssigneeId &&
          !groupMembers.some((u) => u.id === currentAssigneeId)
        ) {
          // Clear assignee if they're not in the selected group
          form.setValue("assigneeId", undefined);
        }
      }
    } else {
      // Clear assignee if no group is selected
      form.setValue("assigneeId", undefined);
    }
  }, [selectedGroupId, groupMembers, groupMembersLoading, form]);

  // Watch for category changes and fetch subcategories
  useEffect(() => {
    if (selectedCategoryId) {
      const currentSubcategoryId = form.getValues("subcategoryId");
      fetchCaseSubcategories(selectedCategoryId)
        .then((subcats) => {
          setSubcategories(subcats);
          // Clear subcategory if it doesn't belong to the new category
          if (
            currentSubcategoryId &&
            !subcats.some((sc) => sc.id === currentSubcategoryId)
          ) {
            form.setValue("subcategoryId", "");
          }
        })
        .catch((error) => {
          toast.error("Failed to load subcategories");
          setSubcategories([]);
          form.setValue("subcategoryId", "");
        });
    } else {
      setSubcategories([]);
      form.setValue("subcategoryId", "");
    }
  }, [selectedCategoryId, form]);

  useEffect(() => {
    // Fetch business lines
    fetchBusinessLines()
      .then(setBusinessLines)
      .catch((error) => toast.error("Failed to load business lines"));

    // Fetch services
    listServices()
      .then(setServices)
      .catch((error) => toast.error("Failed to load services"));

    // Fetch categories
    fetchCaseCategories()
      .then(setCategories)
      .catch((error) => toast.error("Failed to load categories"));

    // Prefill if editing
    if (id) {
      setLoading(true);
      fetchCaseById(id)
        .then(async (data) => {
          setCaseData(data);
          // Fetch subcategories for the case's category
          if (data.categoryId) {
            try {
              const subcats = await fetchCaseSubcategories(data.categoryId);
              setSubcategories(subcats);
            } catch (error) {
              // Ignore error, subcategories will be empty
            }
          }
          form.reset({
            title: data.title,
            description: data.description || "",
            priority: data.priority,
            status: data.status,
            requesterId: data.requesterId || "",
            assigneeId: data.assigneeId || undefined,
            assignmentGroupId: data.assignmentGroupId || "",
            businessLineId: data.businessLineId,
            categoryId: data.categoryId || "",
            subcategoryId: data.subcategoryId || "",
            affectedServiceId: data.affectedServiceId || undefined,
            requestCardId: data.requestCardId || undefined,
          });
        })
        .catch((error) => {
          toast.error(`Failed to fetch case: ${error.message}`);
          router.push("/cases");
        })
        .finally(() => setLoading(false));
    }
  }, [id, form, router]);

  // Re-apply form values once groups and users are loaded (for Select components to display)
  useEffect(() => {
    if (
      caseData &&
      !usersLoading &&
      !groupsLoading &&
      isEditMode &&
      users.length > 0 &&
      groups.length > 0
    ) {
      form.reset({
        title: caseData.title,
        description: caseData.description || "",
        priority: caseData.priority,
        status: caseData.status,
        requesterId: caseData.requesterId || "",
      });
      form.setValue("assignmentGroupId", caseData.assignmentGroupId || "");
      form.setValue("businessLineId", caseData.businessLineId || "");
      form.setValue("requesterId", caseData.requesterId || "");
      form.setValue("assigneeId", caseData.assigneeId || undefined);
      form.setValue("categoryId", caseData.categoryId || "");
      form.setValue("subcategoryId", caseData.subcategoryId || "");
      form.setValue(
        "affectedServiceId",
        caseData.affectedServiceId || undefined
      );
      form.setValue("requestCardId", caseData.requestCardId || undefined);
    }
  }, [
    caseData,
    usersLoading,
    groupsLoading,
    isEditMode,
    users.length,
    groups.length,
    form,
  ]);

  const onSubmit = async (data: CreateCaseFormData | UpdateCaseFormData) => {
    const promise = async () => {
      if (id) {
        // For update, only send fields that are defined
        // TypeScript narrows: when id exists, data is validated against updateCaseSchema
        const updateData = data as UpdateCaseFormData;
        const payload: UpdateCaseFormData = {};
        if (updateData.title) payload.title = updateData.title;
        if (updateData.description !== undefined)
          payload.description = updateData.description || undefined;
        if (updateData.priority) payload.priority = updateData.priority;
        if (updateData.status) payload.status = updateData.status;
        if (updateData.assigneeId) payload.assigneeId = updateData.assigneeId;
        if (updateData.assignmentGroupId)
          payload.assignmentGroupId = updateData.assignmentGroupId;
        if (updateData.categoryId) payload.categoryId = updateData.categoryId;
        if (updateData.subcategoryId)
          payload.subcategoryId = updateData.subcategoryId;
        await updateCase(id, payload);
      } else {
        // For create, ensure required fields are present
        // TypeScript narrows: when !id, data is validated against createCaseSchema
        const createData = data as CreateCaseFormData;
        await createCase({
          title: createData.title,
          description: createData.description || undefined,
          priority: createData.priority,
          requesterId: createData.requesterId,
          assigneeId: createData.assigneeId || undefined,
          assignmentGroupId: createData.assignmentGroupId,
          businessLineId: createData.businessLineId,
          categoryId: createData.categoryId,
          subcategoryId: createData.subcategoryId,
          affectedServiceId: createData.affectedServiceId || undefined,
          requestCardId: createData.requestCardId || undefined,
        });
      }
    };

    toast.promise(promise, {
      loading: isEditMode ? "Updating case..." : "Creating case...",
      success: () => {
        queryClient.invalidateQueries({ queryKey: ["cases"] });
        if (id) {
          queryClient.invalidateQueries({ queryKey: ["case", id] });
        }
        router.push(id ? `/cases/${id}` : "/cases");
        return isEditMode
          ? "Case updated successfully"
          : "Case created successfully";
      },
      error: (error) => {
        return error.message || "Failed to save case";
      },
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
              <CardDescription>
                Who is reporting or requesting this case?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="requesterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Requester
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground border-muted-foreground/30"
                      >
                        Required
                      </Badge>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                      disabled={
                        isEditMode ||
                        form.formState.isSubmitting ||
                        usersLoading
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select requester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.displayName || user.email || user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {isEditMode
                        ? "The requester cannot be changed after case creation"
                        : "The person requesting this case"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Display Requester Details */}
              {selectedRequesterId && requesterDetails && (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Requester Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Username/Login */}
                    <div className="flex items-start gap-3">
                      <UserIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Username
                        </p>
                        <p className="text-sm font-medium truncate">
                          {requesterDetails.username || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium truncate">
                          {requesterDetails.email || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium truncate">
                          {requesterDetails.metadata?.phone ||
                            requesterDetails.metadata?.mobile ||
                            "-"}
                        </p>
                      </div>
                    </div>

                    {/* Department */}
                    <div className="flex items-start gap-3">
                      <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Department
                        </p>
                        <p className="text-sm font-medium truncate">
                          {requesterDetails.metadata?.department || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="flex items-start gap-3">
                      <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Title</p>
                        <p className="text-sm font-medium truncate">
                          {requesterDetails.metadata?.title || "-"}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          Location
                        </p>
                        <p className="text-sm font-medium truncate">
                          {[
                            requesterDetails.metadata?.location,
                            requesterDetails.metadata?.city,
                            requesterDetails.metadata?.country,
                          ]
                            .filter(Boolean)
                            .join(", ") || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading state for requester details */}
              {selectedRequesterId && requesterLoading && (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ticket Information</CardTitle>
              <CardDescription>
                Details about the case and what it involves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Title
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground border-muted-foreground/30"
                      >
                        Required
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter case title"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief, descriptive title for the case
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter case description"
                        className="min-h-[100px]"
                        {...field}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed description of the case
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Priority
                        <Badge
                          variant="outline"
                          className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground border-muted-foreground/30"
                        >
                          Required
                        </Badge>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                        disabled={form.formState.isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={CasePriority.LOW}>Low</SelectItem>
                          <SelectItem value={CasePriority.MEDIUM}>
                            Medium
                          </SelectItem>
                          <SelectItem value={CasePriority.HIGH}>
                            High
                          </SelectItem>
                          <SelectItem value={CasePriority.CRITICAL}>
                            Critical
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Case priority level</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditMode && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={form.formState.isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CASE_STATUS_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Current case status</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="businessLineId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Business Line
                        <Badge
                          variant="outline"
                          className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground border-muted-foreground/30"
                        >
                          Required
                        </Badge>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                        disabled={form.formState.isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business line" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessLines
                            .filter((bl) => bl.active !== false)
                            .map((bl) => (
                              <SelectItem key={bl.id} value={bl.id}>
                                {bl.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The business line this case belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="affectedServiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affected Service</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(
                            value === "__none__" ? undefined : value
                          );
                        }}
                        value={field.value || "__none__"}
                        disabled={form.formState.isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">None</SelectItem>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Optional: The service affected by this case
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Category
                        <Badge
                          variant="outline"
                          className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground border-muted-foreground/30"
                        >
                          Required
                        </Badge>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                        disabled={form.formState.isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories
                            .filter((cat) => cat.active !== false)
                            .map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The category this case belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subcategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Subcategory
                        <Badge
                          variant="outline"
                          className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground border-muted-foreground/30"
                        >
                          Required
                        </Badge>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                        disabled={
                          form.formState.isSubmitting || !selectedCategoryId
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedCategoryId
                                  ? "Select category first"
                                  : "Select subcategory"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategories
                            .filter((subcat) => subcat.active !== false)
                            .map((subcat) => (
                              <SelectItem key={subcat.id} value={subcat.id}>
                                {subcat.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {!selectedCategoryId
                          ? "Select a category first to see available subcategories"
                          : "The subcategory for this case"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Assignment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment</CardTitle>
              <CardDescription>Who should handle this case?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assignmentGroupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Assignment Group
                        <Badge
                          variant="outline"
                          className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground border-muted-foreground/30"
                        >
                          Required
                        </Badge>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                        disabled={form.formState.isSubmitting || groupsLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignment group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {groupsWithMembers.map((group) => (
                            <SelectItem key={group.id} value={group.id || ""}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The group responsible for handling this case
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="assigneeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(
                            value === "__none__" ? undefined : value
                          );
                        }}
                        value={field.value || "__none__"}
                        disabled={
                          form.formState.isSubmitting ||
                          !selectedGroupId ||
                          groupMembersLoading
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedGroupId
                                  ? "Select assignment group first"
                                  : groupMembersLoading
                                  ? "Loading members..."
                                  : "Select assignee (optional)"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="__none__">None</SelectItem>
                          {availableAssignees.length === 0 &&
                          selectedGroupId ? (
                            <SelectItem value="__no_members__" disabled>
                              No members in selected group
                            </SelectItem>
                          ) : (
                            availableAssignees.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.displayName ||
                                  user.email ||
                                  user.username}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {!selectedGroupId
                          ? "Select an assignment group first to see available assignees"
                          : "Assign to a specific user from the selected group"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Case"
                : "Create Case"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
