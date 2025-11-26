"use client";

import { columns } from "@/app/(core)/iam/groups/_components/data-table/columns";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { tableConfig } from "@/app/(core)/iam/groups/_components/data-table/table-config";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import type { Group } from "@/app/(core)/iam/groups/_lib/_types/group.type";

interface GroupsPageClientProps {
  initialGroups: Group[];
}

export default function GroupsPageClient({
  initialGroups,
}: GroupsPageClientProps) {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Groups
          <div className="text-muted-foreground text-sm font-normal">
            Filter and manage your groups
          </div>
        </div>

        <Button size="sm" asChild>
          <Link href="/iam/groups/new" className="flex items-center gap-2">
            <PlusIcon className="size-4" />
            Create Group
          </Link>
        </Button>
      </div>

      <div className="px-4 lg:px-8">
        <DataTable
          data={initialGroups}
          columns={columns}
          config={tableConfig}
          refetch={async () => Promise.resolve()}
        />
      </div>
    </>
  );
}
