"use client";

import SectionCards from "./components/section-cards";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUsers } from "./hooks/useUsers";
import { PlusIcon } from "lucide-react";

export default function UsersPage() {
  const {
    users,
    error,
    isLoading,
    totalUsers,
    newUsers,
    manualUsers,
    importedUsers,
    agentUsers,
    refetch,
  } = useUsers();

  // if (isLoading) return <div className="px-4 lg:px-6">Loading...</div>;
  if (error) return <div className="px-4 lg:px-6">Error: {error.message}</div>;

  // if (!users) return <div className="px-4 lg:px-6">Loading...</div>;

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Users
          <div className="text-muted-foreground text-sm font-normal">
            Filter and manage your assigned users
          </div>
        </div>
        <Button size="sm" asChild>
          <Link
            href="/users/create"
            className="dark:text-foreground flex items-center gap-2"
          >
            <PlusIcon className="size-4" />
            Create User
          </Link>
        </Button>
      </div>

      <div className="px-4 lg:px-6">
        <SectionCards
          totalUsers={totalUsers}
          totalNewUsers={newUsers.length}
          totalManualUsers={manualUsers.length}
          totalImportedUsers={importedUsers.length}
          totalAgentUsers={agentUsers.length}
        />
      </div>
      <div className="px-4 lg:px-6">
        <DataTable
          data={users}
          columns={columns}
          refetch={refetch}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
