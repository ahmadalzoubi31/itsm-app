"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import SectionCards from "@/app/(core)/iam/users/_components/section-cards";
import { columns } from "@/app/(core)/iam/users/_components/data-table/columns";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { tableConfig } from "@/app/(core)/iam/users/_components/data-table/table-config";
import { type User } from "@/app/(core)/iam/users/_lib/_types";

interface UsersPageClientProps {
  initialUsers: User[];
}

const UsersPageClient = ({ initialUsers }: UsersPageClientProps) => {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Users
          <div className="text-sm font-normal text-muted-foreground">
            Filter and manage your assigned users
          </div>
        </div>

        <Button size="sm" asChild>
          <Link
            href="/iam/users/new"
            className="flex items-center gap-2 dark:text-foreground"
          >
            <PlusIcon className="size-4" />
            Create User
          </Link>
        </Button>
      </div>

      {/* <div className="px-4 lg:px-8">
        <SectionCards
          totalUsers={totalUsers}
          totalNewUsers={newUsers.length}
          totalManualUsers={manualUsers.length}
          totalImportedUsers={importedUsers.length}
          totalAgentUsers={agentUsers.length}
        />
      </div> */}

      <div className="px-4 lg:px-8">
        <DataTable
          data={initialUsers}
          columns={columns}
          isLoading={false}
          config={tableConfig}
          refetch={async () => {}}
        />
      </div>
    </>
  );
};

export default UsersPageClient;
