// src/app/(core)/catalog/loading.tsx
export default function Loading() {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-40 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-60 bg-muted rounded-md animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 w-full bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>

        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
