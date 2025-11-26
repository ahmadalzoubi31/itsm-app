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
import { useAssignCase } from "../hooks/useCases";
import { Case } from "../types";
import { toast } from "sonner";
import { UserCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getGroupMembers } from "@/app/(core)/iam/groups/_lib/_hooks/";
import type { User } from "@/app/(core)/iam/users/_lib/_types";

interface ChangeAssigneeDialogProps {
  case: Case;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ChangeAssigneeDialog({
  case: caseData,
  trigger,
  onSuccess,
}: ChangeAssigneeDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: assignCase, isPending } = useAssignCase();
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<
    string | undefined
  >(caseData.assigneeId || undefined);

  // Fetch group members when dialog opens
  const { data: groupMembers = [], isLoading: membersLoading } = useQuery<
    User[]
  >({
    queryKey: ["group-members", caseData.assignmentGroupId],
    queryFn: () => getGroupMembers(caseData.assignmentGroupId as string),
    enabled: open && !!caseData.assignmentGroupId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAssigneeId === caseData.assigneeId) {
      toast.info("Assignee is already set to this user");
      return;
    }

    assignCase(
      {
        id: caseData.id,
        data: { assigneeId: selectedAssigneeId || undefined },
      },
      {
        onSuccess: () => {
          const assignedUser = groupMembers.find(
            (u) => u.id === selectedAssigneeId
          );
          const userName = assignedUser
            ? assignedUser.displayName ||
              assignedUser.email ||
              (assignedUser as any).username
            : "Unassigned";
          toast.success(
            selectedAssigneeId
              ? `Case assigned to ${userName}`
              : "Assignee removed"
          );
          setOpen(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to change assignee");
        },
      }
    );
  };

  const currentAssigneeName = caseData.assignee
    ? caseData.assignee.displayName ||
      caseData.assignee.email ||
      (caseData.assignee as any).username
    : "Unassigned";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <UserCircle className="h-4 w-4 mr-2" />
            Change Assignee
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Assignee</DialogTitle>
          <DialogDescription>
            Assign this case to a user from the assignment group
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-assignee">Current Assignee</Label>
              <div className="text-sm text-muted-foreground">
                {currentAssigneeName}
              </div>
            </div>

            {!caseData.assignmentGroupId ? (
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  Please assign the case to a group first before selecting an
                  assignee.
                </p>
              </div>
            ) : membersLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading group members...
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="assignee">New Assignee</Label>
                <Select
                  value={selectedAssigneeId || "__none__"}
                  onValueChange={(value) =>
                    setSelectedAssigneeId(
                      value === "__none__" ? undefined : value
                    )
                  }
                  disabled={isPending || !caseData.assignmentGroupId}
                >
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Unassigned</SelectItem>
                    {groupMembers.length === 0 ? (
                      <SelectItem value="__no_members__" disabled>
                        No members in group
                      </SelectItem>
                    ) : (
                      groupMembers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.displayName ||
                            user.email ||
                            (user as any).username}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isPending || !caseData.assignmentGroupId || membersLoading
              }
            >
              {isPending ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
