"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LockIcon, PlusIcon } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { columns } from "@/app/(core)/iam/roles/_components/data-table/columns";
import { tableConfig } from "@/app/(core)/iam/roles/_components/data-table/table-config";
import { Role } from "@/app/(core)/iam/roles/_lib/_types";

interface RolesPageClientProps {
  initialRoles: Role[];
}

export default function RolesPageClient({
  initialRoles,
}: RolesPageClientProps) {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Roles
          <div className="text-muted-foreground text-sm font-normal">
            Manage and configure system roles
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* show permission button */}
          <Button variant="outline" size="sm" asChild>
            <Link
              href="/iam/permissions"
              className="dark:text-foreground flex items-center gap-2"
            >
              <LockIcon className="size-4" />
              Permissions
            </Link>
          </Button>{" "}
          <Button size="sm" asChild>
            <Link
              href="/iam/roles/new"
              className="dark:text-foreground flex items-center gap-2"
            >
              <PlusIcon className="size-4" />
              Create Role
            </Link>
          </Button>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <DataTable
          data={initialRoles}
          columns={columns}
          isLoading={false}
          config={tableConfig}
          refetch={async () => Promise.resolve()}
        />
      </div>
    </>
  );
}
