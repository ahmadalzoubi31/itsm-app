"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { RequestCardFormValues } from "@/app/(core)/catalog/admin/request-cards/_lib/_schemas/request-card.schema";

interface ApprovalStepsCardProps {
  stepIndex: number;
  step: {
    order: number;
    type: "manager" | "direct" | "group";
    config?: {
      userId?: string;
      groupId?: string;
      requireAll?: boolean;
    };
  };
  maxOrder: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  users: Array<{ id: string; displayName: string; username: string }>;
  groups: Array<{ id: string; name: string; memberships?: Array<any> }>;
}

const ApprovalStepsCard = ({
  stepIndex,
  step,
  maxOrder,
  onMoveUp,
  onMoveDown,
  onDelete,
  users,
  groups,
}: ApprovalStepsCardProps) => {
  // HOOKS
  // Custom Hooks
  const form = useFormContext<RequestCardFormValues>();

  // React Hooks

  // EFFECTS
  // useEffect(() => {}, []);

  // HELPERS
  // const helperFn = () => {};

  // EVENT HANDLERS
  const handleTypeChange = (value: string) => {
    const currentSteps = form.getValues("approvalSteps") || [];
    const updatedSteps = [...currentSteps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      type: value as "manager" | "direct" | "group",
      config: undefined,
    };
    form.setValue("approvalSteps", updatedSteps, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleUserIdChange = (value: string) => {
    const currentSteps = form.getValues("approvalSteps") || [];
    const updatedSteps = [...currentSteps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      config: {
        ...updatedSteps[stepIndex].config,
        userId: value,
      },
    };
    form.setValue("approvalSteps", updatedSteps, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleGroupIdChange = (value: string) => {
    const currentSteps = form.getValues("approvalSteps") || [];
    const updatedSteps = [...currentSteps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      config: {
        ...updatedSteps[stepIndex].config,
        groupId: value,
      },
    };
    form.setValue("approvalSteps", updatedSteps, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleRequireAllChange = (checked: boolean) => {
    const currentSteps = form.getValues("approvalSteps") || [];
    const updatedSteps = [...currentSteps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      config: {
        ...updatedSteps[stepIndex].config,
        requireAll: checked,
      },
    };
    form.setValue("approvalSteps", updatedSteps, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // RENDER LOGIC
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Order {step.order}:</span>
            <FormField
              control={form.control}
              name={`approvalSteps.${stepIndex}.type`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleTypeChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Manager Approval</SelectItem>
                      <SelectItem value="direct">User Approval</SelectItem>
                      <SelectItem value="group">Group Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {step.type === "direct" && (
            <FormField
              control={form.control}
              name={`approvalSteps.${stepIndex}.config.userId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approver User</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleUserIdChange(value);
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select approver user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.displayName} ({user.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    User who must approve at this step
                  </FormDescription>
                </FormItem>
              )}
            />
          )}

          {step.type === "group" && (
            <>
              <FormField
                control={form.control}
                name={`approvalSteps.${stepIndex}.config.groupId`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approval Group</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleGroupIdChange(value);
                      }}
                      value={field.value || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select approval group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups
                          .filter(
                            (group) =>
                              group.memberships && group.memberships.length > 0
                          )
                          .map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Group whose members can approve at this step
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`approvalSteps.${stepIndex}.config.requireAll`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleRequireAllChange(checked as boolean);
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Require All to Approve</FormLabel>
                      <FormDescription>
                        If checked, all group members must approve. If
                        unchecked, only one approval is needed.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            type="button"
            variant="ghost"
            disabled={step.order === 1}
            onClick={onMoveUp}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            type="button"
            variant="ghost"
            disabled={step.order === maxOrder}
            onClick={onMoveDown}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ApprovalStepsCard;
