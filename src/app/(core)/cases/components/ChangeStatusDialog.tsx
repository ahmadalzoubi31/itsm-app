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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useChangeCaseStatus } from "../hooks/useCases";
import { Case, CaseStatus, CASE_STATUS_OPTIONS } from "../types";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface ChangeStatusDialogProps {
  case: Case;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ChangeStatusDialog({
  case: caseData,
  trigger,
  onSuccess,
}: ChangeStatusDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: changeStatus, isPending } = useChangeCaseStatus();
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus>(
    caseData.status
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStatus === caseData.status) {
      toast.info("Status is already set to " + selectedStatus);
      return;
    }

    changeStatus(
      {
        id: caseData.id,
        data: { status: selectedStatus },
      },
      {
        onSuccess: () => {
          toast.success(`Status changed to ${selectedStatus}`);
          setOpen(false);
          onSuccess?.();
        },
        onError: (error) => {
          toast.error("Failed to change status", {
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
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Change Status
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Status</DialogTitle>
          <DialogDescription>
            Change the status of case {caseData.number}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">
              New Status <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as CaseStatus)}
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
              {isPending ? "Changing..." : "Change Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
