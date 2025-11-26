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
import { Label } from "@/components/ui/label";
import { useAssignCase } from "../hooks/useCases";
import { Case } from "../types";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

interface AssignCaseDialogProps {
  case: Case;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AssignCaseDialog({
  case: caseData,
  trigger,
  onSuccess,
}: AssignCaseDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: assignCase, isPending } = useAssignCase();

  const [formData, setFormData] = useState({
    assigneeId: caseData.assigneeId || "",
    assignmentGroupId: caseData.assignmentGroupId || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.assigneeId && !formData.assignmentGroupId) {
      toast.error("Please provide at least assignee or assignment group");
      return;
    }

    assignCase(
      {
        id: caseData.id,
        data: formData,
      },
      {
        onSuccess: () => {
          toast.success("Case assigned successfully");
          setOpen(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast.error("Failed to assign case", {
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
            <UserPlus className="h-4 w-4 mr-2" />
            Assign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Case</DialogTitle>
          <DialogDescription>
            Assign case {caseData.number} to a user or group
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assigneeId">Assignee ID</Label>
            <Input
              id="assigneeId"
              value={formData.assigneeId}
              onChange={(e) =>
                setFormData({ ...formData, assigneeId: e.target.value })
              }
              placeholder="User ID"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Assign to a specific user
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignmentGroupId">Assignment Group ID</Label>
            <Input
              id="assignmentGroupId"
              value={formData.assignmentGroupId}
              onChange={(e) =>
                setFormData({ ...formData, assignmentGroupId: e.target.value })
              }
              placeholder="Group ID"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Assign to a support group
            </p>
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
              {isPending ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
