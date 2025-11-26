"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { RequestCardFormValues } from "@/app/(core)/catalog/admin/request-cards/_lib/_schemas/request-card.schema";
import ApprovalStepsCard from "./ApprovalStepCard";

interface ApprovalTabProps {
  users: Array<{ id: string; displayName: string; username: string }>;
  groups: Array<{ id: string; name: string; memberships?: Array<any> }>;
}

const ApprovalTab = ({ users, groups }: ApprovalTabProps) => {
  // HOOKS
  // Custom Hooks
  const form = useFormContext<RequestCardFormValues>();

  // React Hooks

  // EFFECTS
  // useEffect(() => {}, []);

  // HELPERS
  // const helperFn = () => {};

  // EVENT HANDLERS
  const handleAddStep = () => {
    const currentSteps = form.getValues("approvalSteps") || [];
    const newOrder =
      currentSteps.length > 0
        ? Math.max(...currentSteps.map((s) => s.order)) + 1
        : 1;
    form.setValue(
      "approvalSteps",
      [
        ...currentSteps,
        {
          order: newOrder,
          type: "manager" as const,
          config: undefined,
        },
      ],
      { shouldValidate: true, shouldDirty: true, shouldTouch: true }
    );
  };

  const handleMoveUp = (stepIndex: number) => {
    const currentSteps = form.getValues("approvalSteps") || [];
    const updatedSteps = [...currentSteps];
    const currentStep = updatedSteps[stepIndex];
    const prevStep = updatedSteps.find(
      (s) => s.order === currentStep.order - 1
    );
    if (prevStep) {
      const prevIndex = updatedSteps.indexOf(prevStep);
      const temp = currentStep.order;
      currentStep.order = prevStep.order;
      prevStep.order = temp;
      form.setValue("approvalSteps", updatedSteps, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleMoveDown = (stepIndex: number) => {
    const currentSteps = form.getValues("approvalSteps") || [];
    const updatedSteps = [...currentSteps];
    const currentStep = updatedSteps[stepIndex];
    const nextStep = updatedSteps.find(
      (s) => s.order === currentStep.order + 1
    );
    if (nextStep) {
      const nextIndex = updatedSteps.indexOf(nextStep);
      const temp = currentStep.order;
      currentStep.order = nextStep.order;
      nextStep.order = temp;
      form.setValue("approvalSteps", updatedSteps, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  const handleDelete = (stepIndex: number) => {
    const currentSteps = form.getValues("approvalSteps") || [];
    const updatedSteps = currentSteps.filter((_, i) => i !== stepIndex);
    // Reorder remaining steps
    updatedSteps.forEach((s, i) => {
      s.order = i + 1;
    });
    form.setValue("approvalSteps", updatedSteps, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // RENDER LOGIC
  const approvalSteps = form.watch("approvalSteps") || [];
  const maxOrder =
    approvalSteps.length > 0
      ? Math.max(...approvalSteps.map((s) => s.order))
      : 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Approval Configuration</CardTitle>
        <CardDescription>
          Configure ordered approval steps for requests from this card
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="approvalSteps"
          render={({ field }) => (
            <FormItem>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Approval Steps</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStep}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
                <FormDescription>
                  Define the approval workflow. Steps are processed in order (1,
                  2, 3...). Each step must be completed before the next one
                  begins.
                </FormDescription>

                {approvalSteps.length > 0 ? (
                  <div className="space-y-3">
                    {approvalSteps
                      .map((step, originalIndex) => ({
                        step,
                        originalIndex,
                      }))
                      .sort((a, b) => a.step.order - b.step.order)
                      .map(({ step, originalIndex }) => (
                        <ApprovalStepsCard
                          key={originalIndex}
                          stepIndex={originalIndex}
                          step={step}
                          maxOrder={maxOrder}
                          onMoveUp={() => handleMoveUp(originalIndex)}
                          onMoveDown={() => handleMoveDown(originalIndex)}
                          onDelete={() => handleDelete(originalIndex)}
                          users={users}
                          groups={groups}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground border rounded-lg">
                    No approval steps configured. Click "Add Step" to create an
                    approval workflow.
                  </div>
                )}
              </div>
              <FormMessage className="mt-2" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ApprovalTab;
