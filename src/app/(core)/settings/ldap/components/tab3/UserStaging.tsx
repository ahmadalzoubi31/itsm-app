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
import { Users, UserPlus, UserX, Download } from "lucide-react";
import { toast } from "sonner";
import { useStagedUsers } from "../../hooks/useStagedUser";
import { DataTable } from "./data-table";
import columns from "./columns";
import { importUsers } from "../../services/stage-user.service";

export const UserStaging = () => {
  const {
    users: stagedUsers,
    error,
    isLoading,
    refetch,
    importMutation,
    rejectMutation,
  } = useStagedUsers();
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Helper to get selected IDs from rowSelection
  const selectedIds = Object.keys(rowSelection).filter(
    (id) => rowSelection[id]
  );

  const importSelectedUsers = async () => {
    if (selectedIds.length === 0) return;
    try {
      const promise = async () => {
        const response = await importMutation.mutateAsync(selectedIds);
        return response;
      };
      toast.promise(promise, {
        loading: "Importing users...",
        success: async () => {
          await refetch();
          setRowSelection({}); // Clear selection
          return "Users imported";
        },
        error: (error) => {
          return `${error}`;
        },
      });
    } catch (error: any) {
      console.error("Error importing users:", error);
      toast.error("Error importing users");
    }
  };

  const rejectSelectedUsers = async () => {
    if (selectedIds.length === 0) return;
    try {
      const promise = async () => {
        const response = await rejectMutation.mutateAsync(selectedIds);
        return response;
      };
      toast.promise(promise, {
        loading: "Rejecting users...",
        success: async () => {
          await refetch();
          setRowSelection({}); // Clear selection
          return "Users rejected";
        },
        error: (error) => {
          return `${error}`;
        },
      });
    } catch (error: any) {
      console.error("Error rejecting users:", error);
      toast.error("Error rejecting users");
    }
  };

  const exportUserList = () => {
    //export only the selected users
    if (selectedIds.length === 0) {
      toast.error("No users selected");
      return;
    }

    console.log("🚀 ~ exportUserList ~ selectedIds:", selectedIds);
    const csvContent = [
      "Display Name,Email,Username,Department,Status",
      ...stagedUsers
        .filter((user) => selectedIds.includes(user.id))
        .map(
          (user) =>
            `"${user.displayName}","${user.mail}","${user.sAMAccountName}","${user.department}","${user.status}"`
        ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "staged_users.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Export completed");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Staging Area
          </CardTitle>
          <CardDescription>
            Review and manage users retrieved from LDAP before importing them
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <Button
              size="sm"
              onClick={importSelectedUsers}
              size="sm"
              disabled={selectedIds.length === 0}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Import Selected ({selectedIds.length})
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={rejectSelectedUsers}
              size="sm"
              disabled={selectedIds.length === 0}
              className="flex items-center gap-2"
            >
              <UserX className="w-4 h-4" />
              Reject Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              size="sm"
              onClick={exportUserList}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={stagedUsers}
            refetch={refetch}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />
        </CardContent>
      </Card>
    </div>
  );
};
