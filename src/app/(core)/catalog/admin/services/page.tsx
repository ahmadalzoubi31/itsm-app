// src/app/(core)/catalog/admin/services/page.tsx

"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import columns from "./_components/data-table/columns";
import { tableConfig } from "./_components/data-table/table-config";
import { useServicesHook } from "./_lib/_hooks/useServices.hook";

export default function ServicesManagementPage() {
  const { services, isLoading, error } = useServicesHook();

  if (error) {
    return (
      <div className="px-4 lg:px-8">
        <div className="text-destructive">
          Error loading services: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/catalog/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-2">
            Manage catalog services and their configurations
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/catalog/admin/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Service
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={services}
          refetch={async () => {}}
          config={tableConfig}
        />
      )}
    </div>
  );
}
