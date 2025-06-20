"use client";

import SectionCards from "./components/section-cards";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./hooks/useUser";

export default function UsersPage() {
  const {
    users,
    refetch,
    isLoading,
    error,
    totalUsers,
    newUsers,
    pendingUsers,
    rejectedUsers,
    activeUsers,
  } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!users) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                  Users
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Filter and manage your assigned users
                </CardDescription>
              </div>
            </div>
          </div>

          <Button asChild size="sm" className="hidden sm:flex">
            <Link href="/users/create" className="dark:text-foreground">
              Create User
            </Link>
          </Button>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2  mb-4">
            <div className="flex flex-col gap-4">
              <SectionCards
                totalUsers={totalUsers}
                totalNewUsers={newUsers.length}
                totalPendingUsers={pendingUsers.length}
                totalRejectedUsers={rejectedUsers.length}
              />
            </div>
          </div>
        </div>
        <DataTable data={users} columns={columns} refetch={refetch} />
      </div>
    </div>
  );
}
