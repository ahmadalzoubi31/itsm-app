// app/(core)/iam/roles/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-9 w-[120px]" />
      </div>

      <div className="px-4 lg:px-8">
        <Skeleton className="h-96 w-full rounded-md" />
      </div>
    </>
  );
};

export default Loading;
