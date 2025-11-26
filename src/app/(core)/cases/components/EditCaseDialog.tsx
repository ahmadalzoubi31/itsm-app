"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUpdateCase } from "../hooks/useCases";
import {
  Case,
  CasePriority,
  CaseStatus,
  CASE_PRIORITY_OPTIONS,
  CASE_STATUS_OPTIONS,
} from "../types";
import { toast } from "sonner";
import { Edit } from "lucide-react";

interface EditCaseDialogProps {
  case: Case;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function EditCaseDialog({
  case: caseData,
  trigger,
  onSuccess,
}: EditCaseDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: updateCase, isPending } = useUpdateCase();

  const [formData, setFormData] = useState({
    title: caseData.title,
    description: caseData.description || "",
    status: caseData.status,
    priority: caseData.priority,
    assigneeId: caseData.assigneeId || "",
    assignmentGroupId: caseData.assignmentGroupId || "",
  });

  // Reset form when case changes
  useEffect(() => {
    setFormData({
      title: caseData.title,
      description: caseData.description || "",
      status: caseData.status,
      priority: caseData.priority,
      assigneeId: caseData.assigneeId || "",
      assignmentGroupId: caseData.assignmentGroupId || "",
    });
  }, [caseData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    updateCase(
      {
        id: caseData.id,
        data: formData,
      },
      {
        onSuccess: () => {
          toast.success("Case updated successfully");
          setOpen(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast.error("Failed to update case", {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Case</DialogTitle>
          <DialogDescription>
            Update case details for {caseData.number}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Brief description of the case"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Detailed description..."
              rows={4}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as CaseStatus })
                }
                disabled={isPending}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {CASE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value as CasePriority })
                }
                disabled={isPending}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {CASE_PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigneeId">Assignee ID</Label>
              <Input
                id="assigneeId"
                value={formData.assigneeId}
                onChange={(e) =>
                  setFormData({ ...formData, assigneeId: e.target.value })
                }
                placeholder="Assignee user ID"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignmentGroupId">Assignment Group ID</Label>
              <Input
                id="assignmentGroupId"
                value={formData.assignmentGroupId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignmentGroupId: e.target.value,
                  })
                }
                placeholder="Assignment group ID"
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Case"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
