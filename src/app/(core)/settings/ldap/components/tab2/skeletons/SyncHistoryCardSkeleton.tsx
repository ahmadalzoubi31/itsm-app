import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";

export function SyncHistoryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Synchronization History
        </CardTitle>
        <CardDescription>
          History of previous synchronization runs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-1/3" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
