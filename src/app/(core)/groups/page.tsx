"use client";

import SectionCards from "./components/section-cards";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Button } from "@/components/ui/button";
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
