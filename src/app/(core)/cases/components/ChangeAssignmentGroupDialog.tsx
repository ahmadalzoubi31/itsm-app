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
import { Users } from "lucide-react";
import { useGroupsHook } from "@/app/(core)/iam/groups/_lib/_hooks/useGroups";
import { useQueries } from "@tanstack/react-query";
import { getGroupMembers } from "@/app/(core)/iam/groups/_lib/_services/group.service";

interface ChangeAssignmentGroupDialogProps {
  case: Case;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function ChangeAssignmentGroupDialog({
  case: caseData,
  trigger,
  onSuccess,
}: ChangeAssignmentGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: assignCase, isPending } = useAssignCase();
  const { groups, isLoading: groupsLoading } = useGroupsHook();
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(
    caseData.assignmentGroupId || undefined
  );

  // Filter groups to exclude hidden ones (groups starting with "Hide")
  const visibleGroups = groups.filter(
    (group) => !group.name.toLowerCase().startsWith("hide")
  );

  // Fetch members for all visible groups to check which ones have members
  const groupMembersQueries = useQueries({
    queries: visibleGroups.map((group) => ({
      queryKey: ["group-members-check", group.id],
      queryFn: () => getGroupMembers(group.id),
      enabled: open,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    })),
  });

  // Filter out groups that have no members
  const groupsWithMembers = visibleGroups.filter((group, index) => {
    const membersQuery = groupMembersQueries[index];
    return membersQuery?.data && membersQuery.data.length > 0;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGroupId) {
      toast.error("Please select a group");
      return;
    }

    if (selectedGroupId === caseData.assignmentGroupId) {
      toast.info("Assignment group is already set to this group");
      return;
    }

    assignCase(
      {
        id: caseData.id,
        data: {
          assignmentGroupId: selectedGroupId,
          // Clear assignee when changing group
          assigneeId: undefined,
        },
      },
      {
        onSuccess: () => {
          const selectedGroup = groupsWithMembers.find(
            (g) => g.id === selectedGroupId
          );
          toast.success(
            `Case assigned to ${selectedGroup?.name || "selected group"}`
          );
          setOpen(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to change assignment group");
        },
      }
    );
  };

  const currentGroupName = caseData.assignmentGroup
    ? caseData.assignmentGroup.name
    : "No group assigned";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Change Group
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Assignment Group</DialogTitle>
          <DialogDescription>
            Assign this case to a different support group. The current assignee
            will be cleared.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-group">Current Group</Label>
              <div className="text-sm text-muted-foreground">
                {currentGroupName}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">New Assignment Group</Label>
              <Select
                value={selectedGroupId}
                onValueChange={setSelectedGroupId}
                disabled={isPending || groupsLoading}
              >
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groupsWithMembers.map((group) => (
                    <SelectItem key={group.id} value={group.id || ""}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Only groups with members are shown
              </p>
            </div>

            {selectedGroupId &&
              selectedGroupId !== caseData.assignmentGroupId && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ Changing the group will clear the current assignee. You
                    can reassign after changing the group.
                  </p>
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
            <Button type="submit" disabled={isPending || !selectedGroupId}>
              {isPending ? "Changing..." : "Change Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
