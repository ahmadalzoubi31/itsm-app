"use client";

import { Request } from "../_lib/_types/request.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Clock,
  UserCheck,
  Loader2,
  CheckCheck,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils/cn";

interface RequestTimelineProps {
  request: Request;
}

export function RequestTimeline({ request }: RequestTimelineProps) {
  // Check if request requires approval
  const hasApprovalConfig =
    (request.requestCard?.approvalSteps &&
      request.requestCard.approvalSteps.length > 0) ||
    request.status === "WaitingApproval" ||
    (request.approvalRequests && request.approvalRequests.length > 0);

  // Build individual approval events
  const approvalEvents =
    request.approvalRequests && request.approvalRequests.length > 0
      ? request.approvalRequests
          .sort(
            (a, b) =>
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime()
          )
          .map((approval) => {
            const approverName =
              approval.approver?.displayName ||
              `${approval.approver?.firstName || ""} ${
                approval.approver?.lastName || ""
              }`.trim() ||
              approval.approver?.email ||
              "Approver";

            const isApproved = approval.status === "approved";
            const isRejected = approval.status === "rejected";
            const isPending = approval.status === "pending";

            return {
              title: isApproved
                ? "Approved"
                : isRejected
                ? "Rejected"
                : "Awaiting Approval",
              description: isApproved
                ? `Approved by ${approverName}${
                    approval.justification ? `: ${approval.justification}` : ""
                  }`
                : isRejected
                ? `Rejected by ${approverName}${
                    approval.justification ? `: ${approval.justification}` : ""
                  }`
                : `Pending approval from ${approverName}`,
              timestamp: isApproved
                ? approval.approvedAt
                : isRejected
                ? approval.rejectedAt
                : null,
              completed: isApproved || isRejected,
              icon: isApproved
                ? ThumbsUp
                : isRejected
                ? ThumbsDown
                : ShieldCheck,
              color: isApproved
                ? "text-emerald-500"
                : isRejected
                ? "text-red-500"
                : "text-blue-500",
              bgColor: isApproved
                ? "bg-emerald-500/10"
                : isRejected
                ? "bg-red-500/10"
                : "bg-blue-500/10",
              borderColor: isApproved
                ? "border-emerald-500/20"
                : isRejected
                ? "border-red-500/20"
                : "border-blue-500/20",
            };
          })
      : hasApprovalConfig
      ? [
          {
            title: "Waiting for Approval",
            description: "Your request is waiting for approval",
            timestamp: null,
            completed: false,
            icon: ShieldCheck,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
          },
        ]
      : [];

  const events = [
    {
      title: "Request Submitted",
      description: "Your request has been submitted",
      timestamp: request.createdAt,
      completed: true,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    ...approvalEvents,
    {
      title: "Assigned",
      description: (() => {
        // Check if request is assigned directly or if linked case is assigned
        const isAssigned =
          !!request.assigneeId || !!request.linkedCase?.assigneeId;
        if (isAssigned) {
          const assignee = request.linkedCase?.assignee;
          if (assignee) {
            const name =
              assignee.displayName ||
              `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim() ||
              assignee.email;
            return `Case assigned to ${name}`;
          }
          return "Request assigned to team member";
        }
        return "Waiting for assignment";
      })(),
      timestamp:
        request.assigneeId || request.linkedCase?.assigneeId
          ? request.updatedAt
          : null,
      completed: !!request.assigneeId || !!request.linkedCase?.assigneeId,
      icon: UserCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "In Progress",
      description: "Work is actively being done on your request",
      timestamp:
        request.status === "InProgress" ||
        request.status === "Resolved" ||
        request.status === "Closed"
          ? request.updatedAt
          : null,
      completed:
        request.status === "InProgress" ||
        request.status === "Resolved" ||
        request.status === "Closed",
      icon: Loader2,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Resolved",
      description: request.resolution || "Request completed successfully",
      timestamp:
        request.status === "Resolved" || request.status === "Closed"
          ? request.updatedAt
          : null,
      completed: request.status === "Resolved" || request.status === "Closed",
      icon: CheckCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
  ];

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Timeline</CardTitle>
          <Badge variant="outline" className="gap-1.5">
            <Clock className="h-3 w-3" />
            {events.filter((e) => e.completed).length} of {events.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-2 py-2">
          {events.map((event, index) => {
            const Icon = event.icon;
            const isLast = index === events.length - 1;
            const isActive =
              event.completed &&
              (!events[index + 1]?.completed || index === events.length - 1);

            return (
              <div key={index} className="relative flex gap-4">
                {/* Timeline Line and Icon */}
                <div className="relative flex flex-col items-center">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 z-10",
                      event.completed
                        ? cn(event.bgColor, event.borderColor, "shadow-sm")
                        : "bg-background border-border"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        event.completed ? event.color : "text-muted-foreground",
                        event.title === "In Progress" &&
                          event.completed &&
                          "animate-spin"
                      )}
                    />
                  </div>

                  {/* Connecting Line */}
                  {!isLast && (
                    <div
                      className={cn(
                        "w-0.5 flex-1 min-h-[60px] transition-all duration-300 mt-2",
                        event.completed ? event.bgColor : "bg-border/50"
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={cn(
                            "font-semibold text-base transition-colors",
                            event.completed
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {event.title}
                        </h4>
                        {isActive && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "gap-1 px-2 py-0.5 text-xs font-medium",
                              event.color
                            )}
                          >
                            <Circle className="h-2 w-2 fill-current animate-pulse" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm leading-relaxed transition-colors",
                          event.completed
                            ? "text-muted-foreground"
                            : "text-muted-foreground/70"
                        )}
                      >
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp */}
                  {event.completed && event.timestamp && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 mt-2">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(
                          new Date(event.timestamp),
                          "MMM dd, yyyy 'at' h:mm a"
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
