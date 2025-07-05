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
  } = useStagedUsers();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const importSelectedUsers = async () => {
    if (selectedIds.length === 0) return;
    try {
      const response = await importMutation.mutateAsync(selectedIds);
      console.log("🚀 ~ importSelectedUsers ~ response:", response);
      toast.success("Users imported");
      await refetch();
      setSelectedIds([]); // Clear selection
    } catch (error: any) {
      console.error("Error importing users:", error);
      toast.error("Error importing users");
    }
  };

  const rejectSelectedUsers = async () => {
    if (selectedIds.length === 0) return;
    try {
      // TODO: Replace with actual reject logic
      toast.error("Users rejected");
      await refetch();
      setSelectedIds([]); // Clear selection
    } catch (error: any) {
      console.error("Error rejecting users:", error);
      toast.error("Error rejecting users");
    }
  };

  const exportUserList = () => {
    const csvContent = [
      "Display Name,Email,Username,Department,Status",
      ...stagedUsers?.map(
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
              onClick={importSelectedUsers}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Import Selected ({selectedIds.length})
            </Button>
            <Button
              variant="destructive"
              onClick={rejectSelectedUsers}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-2"
            >
              <UserX className="w-4 h-4" />
              Reject Selected
            </Button>
            <Button
              variant="outline"
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
            selectedIds={selectedIds}
            onSelectedIdsChange={setSelectedIds}
          />

          {stagedUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {isLoading
                ? "Loading users..."
                : "No users found matching your criteria"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
