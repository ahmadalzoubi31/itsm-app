"use client";

import { useState } from "react";
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
import { useCreateCase } from "../hooks/useCases";
import { CasePriority, CASE_PRIORITY_OPTIONS } from "../types";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateCaseDialogProps {
  trigger?: React.ReactNode;
  defaultBusinessLineId?: string;
  defaultRequesterId?: string;
}

export function CreateCaseDialog({
  trigger,
  defaultBusinessLineId,
  defaultRequesterId,
}: CreateCaseDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate: createCase, isPending } = useCreateCase();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: CasePriority.MEDIUM,
    businessLineId: defaultBusinessLineId || "",
    requesterId: defaultRequesterId || "",
    assignmentGroupId: "",
    assigneeId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.businessLineId) {
      toast.error("Business Line is required");
      return;
    }

    if (!formData.requesterId) {
      toast.error("Requester is required");
      return;
    }

    if (!formData.assignmentGroupId) {
      toast.error("Assignment Group is required");
      return;
    }

    createCase(formData, {
      onSuccess: (newCase) => {
        toast.success("Case created successfully");
        setOpen(false);
        router.push(`/cases/${newCase.id}`);
        // Reset form
        setFormData({
          title: "",
          description: "",
          priority: CasePriority.MEDIUM,
          businessLineId: defaultBusinessLineId || "",
          requesterId: defaultRequesterId || "",
          assignmentGroupId: "",
          assigneeId: "",
        });
      },
      onError: (error) => {
        toast.error("Failed to create case", {
          description: error.message,
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Case
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new case
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
              <Label htmlFor="priority">
                Priority <span className="text-destructive">*</span>
              </Label>
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

            <div className="space-y-2">
              <Label htmlFor="businessLineId">
                Business Line <span className="text-destructive">*</span>
              </Label>
              <Input
                id="businessLineId"
                value={formData.businessLineId}
                onChange={(e) =>
                  setFormData({ ...formData, businessLineId: e.target.value })
                }
                placeholder="Business Line ID"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requesterId">
                Requester ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="requesterId"
                value={formData.requesterId}
                onChange={(e) =>
                  setFormData({ ...formData, requesterId: e.target.value })
                }
                placeholder="Requester user ID"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignmentGroupId">
                Assignment Group ID <span className="text-destructive">*</span>
              </Label>
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
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assigneeId">Assignee ID (Optional)</Label>
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
              {isPending ? "Creating..." : "Create Case"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
