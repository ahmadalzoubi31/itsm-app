// src/app/(core)/catalog/admin/categories/new/page.tsx
"use client";

import CategoryForm from "../_components/form/category-form";

export default function NewCategoryPage() {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Create Category
          <div className="text-sm font-normal text-muted-foreground">
            Add a new catalog category
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8">
        <CategoryForm id="" />
      </div>
    </>
  );
}
