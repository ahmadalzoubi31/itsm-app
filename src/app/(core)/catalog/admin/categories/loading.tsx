// src/app/(core)/catalog/admin/categories/loading.tsx

export default function Loading() {
  return (
    <div className="px-4 lg:px-8 space-y-6">
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-8 w-28 bg-muted animate-pulse rounded" />
      </div>

      <div className="space-y-4">
        <div className="h-12 w-full rounded bg-muted animate-pulse" />
        <div className="h-40 w-full rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}
