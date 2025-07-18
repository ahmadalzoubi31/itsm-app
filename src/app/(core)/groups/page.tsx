"use client";

import SectionCards from "./components/section-cards";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useGroups } from "./hooks/useGroups";
import { PlusIcon } from "lucide-react";

export default function GroupsPage() {
  const {
    groups,
    error,
    isLoading,
    totalGroups,
    activeGroups,
    supportGroups,
    technicalGroups,
    pendingGroups,
    refetch,
  } = useGroups();

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="space-y-2">
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

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-6">
        <div className="text-2xl font-bold tracking-tight">
          Groups
          <div className="text-muted-foreground text-sm font-normal">
            Manage your support groups and teams
          </div>
        </div>
        <Button size="sm" asChild>
          <Link
            href="/groups/create"
            className="dark:text-foreground flex items-center gap-2"
          >
            <PlusIcon className="size-4" />
            Create Group
          </Link>
        </Button>
      </div>

      <div className="px-4 lg:px-6">
        <SectionCards
          totalGroups={totalGroups}
          totalActiveGroups={activeGroups.length}
          totalSupportGroups={supportGroups.length}
          totalTechnicalGroups={technicalGroups.length}
          totalPendingGroups={pendingGroups.length}
        />
      </div>
      <div className="px-4 lg:px-6">
        <DataTable
          data={groups}
          columns={columns}
          refetch={refetch}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
