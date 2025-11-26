"use client";

import { columns } from "./components/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Key } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { tableConfig } from "./components/table-config";
import { usePermissionsHook } from "./hooks/usePermissions.hook";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { permissions, error, isLoading, refetch } = usePermissionsHook();

  if (error) return <div className="px-4 lg:px-8">Error: {error.message}</div>;

  if (isLoading) {
    return (
      <>
        <div className="flex flex-row items-center justify-between px-4 lg:px-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-9 w-[120px]" />
        </div>

        <div className="px-4 lg:px-8">
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

        <div className="px-4 lg:px-8">
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
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Permissions
          <div className="text-muted-foreground text-sm font-normal">
            Filter and manage your assigned permissions
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link
              href="/iam/roles"
              className="dark:text-foreground flex items-center gap-2"
            >
              <Key className="size-4" />
              View Roles
            </Link>
          </Button>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <DataTable
          data={permissions}
          columns={columns}
          refetch={refetch}
          isLoading={isLoading}
          config={tableConfig}
        />
      </div>
    </>
  );
};

export default Page;
