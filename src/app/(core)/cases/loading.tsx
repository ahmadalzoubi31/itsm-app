// app/(core)/cases/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function CasesLoading() {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Data Table Section */}
      <div className="px-4 lg:px-8 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </>
  );
}
