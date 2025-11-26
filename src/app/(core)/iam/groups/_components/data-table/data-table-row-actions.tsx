"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, Trash, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Group } from "@/app/(core)/iam/groups/_lib/_types/group.type";
import { deleteGroup } from "@/app/(core)/iam/groups/_lib/_services/group.service";
import { GroupMembersDrawer } from "@/app/(core)/iam/groups/_components/form/group-members-drawer";

interface GroupRowActionsProps {
  row: Row<Group>;
}

export function DataTableRowActions({ row }: GroupRowActionsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const group = row.original;

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMembersDrawer, setShowMembersDrawer] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/iam/groups/${group.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteGroup(group.id);
      queryClient.refetchQueries({ queryKey: ["groups"] });
      toast.success("Group deleted successfully");
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error(`Failed to delete group: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowMembersDrawer(true)}>
            <Users className="mr-2 h-4 w-4" />
            View Members
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the group &quot;{group.name}&quot;.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <GroupMembersDrawer
        open={showMembersDrawer}
        onOpenChange={setShowMembersDrawer}
        group={group}
      />
    </>
  );
}
