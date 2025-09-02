"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { ApprovalStep } from "../types";

interface ApprovalWorkflowBuilderProps {
  workflow: ApprovalStep[];
  onChange: (workflow: ApprovalStep[]) => void;
}

export const ApprovalWorkflowBuilder = ({
  workflow,
  onChange,
}: ApprovalWorkflowBuilderProps) => {
  const [showStepDialog, setShowStepDialog] = useState(false);
  const [editingStep, setEditingStep] = useState<ApprovalStep | null>(null);
  const [stepData, setStepData] = useState<Partial<ApprovalStep>>({
    name: "",
    approverRole: "",
    approverUsers: [],
    isRequired: true,
    order: workflow.length + 1,
    autoApprove: false,
    conditions: [],
  });

  const approverRoles = [
    "Manager",
    "Department Head",
    "HR Representative",
    "Finance Team",
    "IT Administrator",
    "Legal Team",
    "Executive",
    "Custom",
  ];

  const handleAddStep = () => {
    setEditingStep(null);
    setStepData({
      name: "",
      approverRole: "",
      approverUsers: [],
      isRequired: true,
      order: workflow.length + 1,
      autoApprove: false,
      conditions: [],
    });
    setShowStepDialog(true);
  };

  const handleEditStep = (step: ApprovalStep) => {
    setEditingStep(step);
    setStepData(step);
    setShowStepDialog(true);
  };

  const handleSaveStep = () => {
    if (!stepData.name) return;

    const newStep: ApprovalStep = {
      id: editingStep?.id || `step_${Date.now()}`,
      name: stepData.name || "",
      approverRole: stepData.approverRole,
      approverUsers: stepData.approverUsers || [],
      isRequired: stepData.isRequired || true,
      order: stepData.order || workflow.length + 1,
      autoApprove: stepData.autoApprove || false,
      conditions: stepData.conditions || [],
    };

    if (editingStep) {
      const updatedWorkflow = workflow.map((s) =>
        s.id === editingStep.id ? newStep : s
      );
      onChange(updatedWorkflow.sort((a, b) => a.order - b.order));
    } else {
      onChange([...workflow, newStep].sort((a, b) => a.order - b.order));
    }

    setShowStepDialog(false);
    resetStepData();
  };

  const handleDeleteStep = (stepId: string) => {
    const updatedWorkflow = workflow
      .filter((s) => s.id !== stepId)
      .map((step, index) => ({ ...step, order: index + 1 }));
    onChange(updatedWorkflow);
  };

  const handleMoveStep = (stepId: string, direction: "up" | "down") => {
    const stepIndex = workflow.findIndex((s) => s.id === stepId);
    if (
      (direction === "up" && stepIndex === 0) ||
      (direction === "down" && stepIndex === workflow.length - 1)
    ) {
      return;
    }

    const newWorkflow = [...workflow];
    const swapIndex = direction === "up" ? stepIndex - 1 : stepIndex + 1;

    // Swap orders
    const tempOrder = newWorkflow[stepIndex].order;
    newWorkflow[stepIndex].order = newWorkflow[swapIndex].order;
    newWorkflow[swapIndex].order = tempOrder;

    onChange(newWorkflow.sort((a, b) => a.order - b.order));
  };

  const resetStepData = () => {
    setStepData({
      name: "",
      approverRole: "",
      approverUsers: [],
      isRequired: true,
      order: workflow.length + 1,
      autoApprove: false,
      conditions: [],
    });
    setEditingStep(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Approval Workflow</CardTitle>
            <CardDescription>
              Configure the approval steps for this service request
            </CardDescription>
          </div>
          <Button onClick={handleAddStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {workflow.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No approval steps configured.</p>
            <p className="text-sm">
              Requests will be auto-approved without workflow.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workflow.map((step, index) => (
              <div key={step.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      {index < workflow.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-gray-400 mt-2 rotate-90" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{step.name}</h4>
                        {step.isRequired ? (
                          <Badge variant="destructive" className="text-xs">
                            Required
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Optional
                          </Badge>
                        )}
                        {step.autoApprove && (
                          <Badge variant="outline" className="text-xs">
                            Auto-approve
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {step.approverRole ? (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {step.approverRole}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Custom approvers
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMoveStep(step.id, "up")}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMoveStep(step.id, "down")}
                      disabled={index === workflow.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditStep(step)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteStep(step.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step Configuration Dialog */}
        <Dialog open={showStepDialog} onOpenChange={setShowStepDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStep ? "Edit Approval Step" : "Add Approval Step"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="step-name">Step Name *</Label>
                <Input
                  id="step-name"
                  value={stepData.name}
                  onChange={(e) =>
                    setStepData({ ...stepData, name: e.target.value })
                  }
                  placeholder="e.g., Manager Approval"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="approver-role">Approver Role</Label>
                  <Select
                    value={stepData.approverRole}
                    onValueChange={(value) =>
                      setStepData({ ...stepData, approverRole: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {approverRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="step-order">Order</Label>
                  <Input
                    id="step-order"
                    type="number"
                    value={stepData.order}
                    onChange={(e) =>
                      setStepData({
                        ...stepData,
                        order: parseInt(e.target.value) || 1,
                      })
                    }
                    min={1}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="step-required"
                    checked={stepData.isRequired}
                    onCheckedChange={(checked) =>
                      setStepData({ ...stepData, isRequired: checked })
                    }
                  />
                  <Label htmlFor="step-required">Required Step</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-approve"
                    checked={stepData.autoApprove}
                    onCheckedChange={(checked) =>
                      setStepData({ ...stepData, autoApprove: checked })
                    }
                  />
                  <Label htmlFor="auto-approve">
                    Auto-approve (conditional)
                  </Label>
                </div>
              </div>

              {stepData.autoApprove && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Auto-approval Conditions
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700">
                    This step will be automatically approved when certain
                    conditions are met. Configure conditions in the advanced
                    settings.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowStepDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveStep} disabled={!stepData.name}>
                <Save className="h-4 w-4 mr-2" />
                {editingStep ? "Update Step" : "Add Step"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
