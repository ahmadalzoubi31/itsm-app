"use client";

import { PendingApproval } from "../services/approval.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApprovalDialog } from "./ApprovalDialog";
import { useState } from "react";
import { format } from "date-fns";
import { User, Calendar, FileText, Clock } from "lucide-react";

interface ApprovalListProps {
  approvals: PendingApproval[];
  onApprove: (requestId: string, justification?: string) => void;
  onReject: (requestId: string, justification: string) => void;
  isLoading?: boolean;
}

export function ApprovalList({
  approvals,
  onApprove,
  onReject,
  isLoading,
}: ApprovalListProps) {
  const [selectedApproval, setSelectedApproval] =
    useState<PendingApproval | null>(null);
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const handleApprove = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setAction("approve");
  };

  const handleReject = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setAction("reject");
  };

  const handleDialogClose = () => {
    setSelectedApproval(null);
    setAction(null);
  };

  const handleDialogSubmit = (justification?: string) => {
    if (!selectedApproval) return;

    if (action === "approve") {
      onApprove(selectedApproval.requestId, justification);
    } else if (action === "reject") {
      if (!justification) {
        return; // Reject requires justification
      }
      onReject(selectedApproval.requestId, justification);
    }

    handleDialogClose();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-3 flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (approvals.length === 0) {
    return (
      <Card className="border-dashed shadow-sm">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <svg
              className="h-12 w-12 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
          <p className="text-muted-foreground max-w-sm">
            You don&apos;t have any pending approvals at the moment. New
            approval requests will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {approvals.map((approval) => (
          <Card
            key={approval.id}
            className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {approval.request.number}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {approval.request.title}
                  </CardTitle>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {approval.request.requester && (
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>
                          {approval.request.requester.displayName}
                          <span className="text-xs ml-1">
                            (@{approval.request.requester.username})
                          </span>
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(
                          new Date(approval.request.createdAt),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {approval.request.description && (
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md border">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {approval.request.description}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="default"
                  onClick={() => handleApprove(approval)}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Approve
                </Button>
                <Button
                  size="default"
                  onClick={() => handleReject(approval)}
                  variant="destructive"
                  className="shadow-sm"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Reject
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  className="ml-auto"
                  onClick={() => {
                    // You can add a view details functionality later
                    console.log("View details:", approval.requestId);
                  }}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedApproval && action && (
        <ApprovalDialog
          open={!!selectedApproval}
          onOpenChange={handleDialogClose}
          approval={selectedApproval}
          action={action}
          onSubmit={handleDialogSubmit}
        />
      )}
    </>
  );
}
