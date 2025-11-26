// src/app/(core)/catalog/admin/subcategories/page.tsx

"use client";

import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import { useSubcategoriesHook } from "@/app/(core)/catalog/admin/subcategories/_lib/_hooks/useSubcategories";
import { useCategoryHook } from "@/app/(core)/catalog/admin/categories/_lib/_hooks/useCategory";
import { columns } from "@/app/(core)/catalog/admin/subcategories/_components/data-table/columns";
import { tableConfig } from "@/app/(core)/catalog/admin/subcategories/_components/data-table/table-config";

export default function SubcategoriesManagementPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") || undefined;

  const { subcategories, isLoading, error, refetch } =
    useSubcategoriesHook(categoryId);
  const { category } = useCategoryHook(categoryId);

  if (error) {
    return (
      <div className="px-4 lg:px-8">
        <div className="text-destructive">
          Error loading subcategories: {error.message}
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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Subcategories</h1>
            {category && (
              <Badge variant="outline" className="text-sm">
                {category.name}
              </Badge>
            )}
          </div>
          <p className="mt-2 text-muted-foreground">
            {categoryId
              ? `Manage subcategories for ${category?.name || "this category"}`
              : "Manage all catalog subcategories"}
          </p>
        </div>

        <Button asChild size="sm">
          <Link
            href={
              categoryId
                ? `/catalog/admin/subcategories/new?categoryId=${categoryId}`
                : "/catalog/admin/subcategories/new"
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Subcategory
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
          data={subcategories}
          refetch={refetch}
          isLoading={isLoading}
          config={tableConfig}
        />
      )}
    </div>
  );
}
