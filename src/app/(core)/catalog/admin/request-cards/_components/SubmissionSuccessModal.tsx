"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Request } from "@/app/(core)/requests/_lib/_types";
import { CheckCircle2, Eye, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubmissionSuccessModalProps {
  request: Request | null;
  open: boolean;
  onClose: () => void;
}

export function SubmissionSuccessModal({
  request,
  open,
  onClose,
}: SubmissionSuccessModalProps) {
  const router = useRouter();

  if (!request) return null;

  const handleViewRequest = () => {
    onClose();
    router.push(`/requests/${request.id}`);
  };

  const handleBrowseMore = () => {
    onClose();
    router.push("/catalog");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Request Submitted!</DialogTitle>
              <DialogDescription className="mt-2">
                Your request has been successfully submitted and is now being
                processed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-muted/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Request ID
              </span>
              <Badge variant="outline" className="font-mono">
                {request.number}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Status
              </span>
              <Badge variant="secondary">{request.status}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Priority
              </span>
              <Badge
                variant={
                  request.priority === "Critical" || request.priority === "High"
                    ? "destructive"
                    : "default"
                }
              >
                {request.priority}
              </Badge>
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            You will receive updates on your request via email
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleBrowseMore}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Browse More Services
          </Button>
          <Button
            size="sm"
            onClick={handleViewRequest}
            className="w-full sm:w-auto"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Request Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
