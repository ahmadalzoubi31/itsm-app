// src/app/(core)/catalog/admin/subcategories/new/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import SubcategoryForm from "@/app/(core)/catalog/admin/subcategories/_components/form/subcategory-form";

export default function NewSubcategoryPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") || undefined;

  return (
    <div className="px-4 lg:px-8">
      <SubcategoryForm defaultCategoryId={categoryId} />
    </div>
  );
}
