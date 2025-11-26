// src/app/(core)/catalog/admin/categories/page.tsx

"use client";

import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useCategoriesHook } from "@/app/(core)/catalog/admin/categories/_lib/_hooks/useCategories";
import { columns } from "@/app/(core)/catalog/admin/categories/_components/data-table/columns";
import { tableConfig } from "@/app/(core)/catalog/admin/categories/_components/data-table/table-config";

export default function CategoriesManagementPage() {
  const { categories, isLoading, error, refetch } = useCategoriesHook();

  if (error) {
    return (
      <div className="px-4 lg:px-8">
        <div className="text-destructive">
          Error loading categories: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link href="/catalog/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="mt-2 text-muted-foreground">
            Manage catalog categories and subcategories
          </p>
        </div>

        <Button asChild size="sm">
          <Link href="/catalog/admin/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Category
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
          data={categories}
          refetch={refetch}
          isLoading={isLoading}
          config={tableConfig}
        />
      )}
    </div>
  );
}
