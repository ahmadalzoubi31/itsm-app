import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function SyncScheduleFormSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Schedule Configuration
        </CardTitle>
        <CardDescription>
          Configure automatic synchronization schedule and settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
      <Separator />
      <div className="flex justify-end px-4 lg:px-8 py-4">
        <Skeleton className="h-10 w-40" />
      </div>
    </Card>
  );
}
