"use client";

import SectionCards from "./components/section-cards";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

  if (error) return <div className="px-4 lg:px-6">Error: {error.message}</div>;

  if (isLoading) {
    return (
      <>
        <div className="flex flex-row items-center justify-between px-4 lg:px-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-9 w-[120px]" />
        </div>

        <div className="px-4 lg:px-6">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="@container/card py-3 rounded-lg border bg-card shadow-sm"
              >
                <div className="space-y-2 p-6">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-[60px]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 lg:px-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-8 w-[100px]" />
            </div>
            <div className="rounded-md border">
              <div className="space-y-4 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-[80px]" />
                      <Skeleton className="h-6 w-[100px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
