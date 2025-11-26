"use client";

import {
  RequestCardFormValues,
  requestCardSchema,
} from "../../../validations/request-card.schema";
import {
  createRequestCard,
  updateRequestCard,
  fetchRequestCardById,
  fetchServices,
} from "../../../services/catalog.service";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroupsHook } from "@/app/(core)/iam/groups/_lib/_hooks/useGroups";
import { useUsers } from "@/app/(core)/iam/users/_lib/_hooks/useUsers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BasicInfoTab from "./BasicInfoTab";
import SchemaTab from "./SchemaTab";
import SettingsTab from "./SettingsTab";
import ApprovalTab from "./ApprovalTab";

interface RequestCardFormProps {
  id?: string;
}

const RequestCardForm = ({ id }: RequestCardFormProps) => {
  // HOOKS
  // Custom Hooks
  const router = useRouter();
  const queryClient = useQueryClient();
  const { groups } = useGroupsHook();
  const { users } = useUsers();

  // React Hooks
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);

  const form = useForm<RequestCardFormValues>({
    resolver: zodResolver(requestCardSchema),
    mode: "all",
    defaultValues: {
      serviceId: "",
      key: "",
      name: "",
      jsonSchema: { type: "object", properties: {}, required: [] },
      uiSchema: {},
      defaults: {},
      defaultAssignmentGroupId: "",
      workflowId: "",
      active: true,
      approvalGroupId: "",
      approvalSteps: [],
    },
  });

  // EFFECTS
  useEffect(() => {
    // Fetch business lines and services
    fetchServices()
      .then((svcs) => {
        setServices(svcs);
      })
      .catch((error) => toast.error(`Failed to load data: ${error.message}`));

    // Prefill if editing
    if (id) {
      setLoading(true);
      fetchRequestCardById(id)
        .then((template) => {
          form.reset({
            serviceId: template.serviceId,
            key: template.key,
            name: template.name,
            jsonSchema: template.jsonSchema,
            uiSchema: template.uiSchema || {},
            defaults: template.defaults || {},
            defaultAssignmentGroupId: template.defaultAssignmentGroupId,
            workflowId: template.workflowId || "",
            active: template.active,
            approvalGroupId: template.approvalGroupId || "",
            approvalConfig: template.approvalConfig,
            approvalSteps: template.approvalSteps || [],
          } as RequestCardFormValues);
        })
        .catch((error) => {
          toast.error(`Failed to fetch request card: ${error.message}`);
          router.push("/catalog/admin/request-cards");
        })
        .finally(() => setLoading(false));
    }
  }, [id, form, router]);

  // EVENT HANDLERS
  const onSubmit = async (data: RequestCardFormValues) => {
    const promise = async () => {
      if (id) {
        // Exclude serviceId and key from update (they're immutable after creation)
        const { serviceId, key, ...updateData } = data;
        const payload = {
          ...updateData,
          workflowId:
            data.workflowId && data.workflowId !== ""
              ? data.workflowId
              : undefined,
          approvalGroupId: data.approvalGroupId || undefined,
          approvalConfig: data.approvalConfig,
          approvalSteps:
            data.approvalSteps && data.approvalSteps.length > 0
              ? data.approvalSteps
              : undefined,
        };
        console.log("Update payload:", payload);
        await updateRequestCard(id, payload);
      } else {
        await createRequestCard({
          serviceId: data.serviceId || "",
          key: data.key,
          name: data.name,
          jsonSchema: data.jsonSchema,
          uiSchema: data.uiSchema,
          defaults: data.defaults,
          defaultAssignmentGroupId: data.defaultAssignmentGroupId,
          workflowId:
            data.workflowId && data.workflowId !== ""
              ? data.workflowId
              : undefined,
          active: data.active,
          approvalGroupId: data.approvalGroupId || undefined,
          approvalConfig: data.approvalConfig,
          approvalSteps:
            data.approvalSteps && data.approvalSteps.length > 0
              ? data.approvalSteps
              : undefined,
        });
      }
    };

    toast.promise(promise, {
      loading: "Saving...",
      success: () => {
        queryClient.refetchQueries({ queryKey: ["request-cards"] });
        router.push("/catalog/admin/request-cards");
        return `Request card ${id ? "updated" : "created"} successfully!`;
      },
      error: (error: any) => {
        return `${error || "Unknown error"}`;
      },
    });
  };

  // HELPERS
  // const helperFn = () => {};

  // EARLY RETURNS
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // RENDER LOGIC
  const isFormValid = form.formState.isValid;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-3xl">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="schema">Questions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="approval">Approval</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <BasicInfoTab services={services} />
            </TabsContent>

            <TabsContent value="schema" className="space-y-6 mt-6">
              <SchemaTab />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-6">
              <SettingsTab groups={groups} />
            </TabsContent>

            <TabsContent value="approval" className="space-y-6 mt-6">
              <ApprovalTab users={users} groups={groups} />
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            {/* Debug info - remove after testing */}
            {process.env.NODE_ENV === "development" && (
              <div className="text-xs text-muted-foreground mr-auto flex flex-col gap-1">
                <div>
                  Valid: {isFormValid ? "✓" : "✗"} | Touched:{" "}
                  {form.formState.touchedFields
                    ? Object.keys(form.formState.touchedFields).length
                    : 0}{" "}
                  | Dirty: {form.formState.isDirty ? "Yes" : "No"}
                </div>
                {Object.keys(form.formState.errors).length > 0 && (
                  <div className="text-red-500">
                    Errors: {JSON.stringify(form.formState.errors, null, 2)}
                  </div>
                )}
              </div>
            )}
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => router.push("/catalog/admin/request-cards")}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={!isFormValid || hasErrors}
            >
              {loading
                ? "Saving..."
                : id
                  ? "Update Request Card"
                  : "Create Request Card"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default RequestCardForm;
