// src/app/(core)/catalog/admin/subcategories/[id]/edit/page.tsx

"use client";

import SubcategoryForm from "@/app/(core)/catalog/admin/subcategories/_components/form/subcategory-form";

type Props = {
  params: {
    id: string;
  };
};

export default function EditSubcategoryPage({ params }: Props) {
  return (
    <div className="px-4 lg:px-8">
      <SubcategoryForm id={params.id} />
    </div>
  );
}
