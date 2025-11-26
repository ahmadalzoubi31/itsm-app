// src/app/(core)/catalog/admin/subcategories/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function SubcategoriesLoadingPage() {
  return (
    <div className="space-y-6 px-4 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
