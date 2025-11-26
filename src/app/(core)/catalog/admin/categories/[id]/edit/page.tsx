// src/app/(core)/catalog/admin/categories/[id]/edit/page.tsx
"use client";

import { useParams } from "next/navigation";
import CategoryForm from "../../_components/form/category-form";

export default function EditCategoryPage() {
  const { id } = useParams();

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Edit Category
          <div className="text-sm font-normal text-muted-foreground">
            Update category details
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <CategoryForm id={id as string} />
      </div>
    </>
  );
}
