"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Case } from "../types";
import { useCaseTimeline } from "../hooks/useCases";
import {
  Clock,
  CheckCircle2,
  User,
  Users,
  FileEdit,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface CaseTimelineProps {
  case: Case;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case "case.created":
      return CheckCircle2;
    case "case.assigned":
      return User;
    case "case.group.assigned":
      return Users;
    case "case.status.changed":
      return ArrowRight;
    case "case.updated":
      return FileEdit;
    default:
      return Clock;
  }
};

export function CaseTimeline({ case: caseData }: CaseTimelineProps) {
  const { timeline, isLoading, error } = useCaseTimeline(caseData.id);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Failed to load timeline events
          </p>
        </CardContent>
      </Card>
    );
  }

  const timelineEvents = timeline.length > 0 ? timeline : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {timelineEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No timeline events available
          </p>
        ) : (
          <div className="space-y-4">
            {timelineEvents.map((event, index) => {
              const Icon = getEventIcon(event.type);
              return (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    {index < timelineEvents.length - 1 && (
                      <div className="w-px h-full bg-border mt-2 min-h-[40px]" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    {/* <p className="text-xs text-muted-foreground leading-relaxed">
                      {event.description}
                    </p> */}

                    {/* Creation Event Details */}
                    {event.type === "case.created" && event.data && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border/50 space-y-2 text-xs">
                        <div className="font-semibold text-foreground mb-2">
                          Case Details:
                        </div>
                        {event.data.title && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Title:
                            </span>
                            <span className="text-foreground">
                              {event.data.title}
                            </span>
                          </div>
                        )}
                        {event.data.priority && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Priority:
                            </span>
                            <span className="text-foreground">
                              {event.data.priority}
                            </span>
                          </div>
                        )}
                        {event.data.description && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Description:
                            </span>
                            <span className="text-foreground flex-1">
                              {event.data.description.length > 150
                                ? `${event.data.description.substring(
                                    0,
                                    150
                                  )}...`
                                : event.data.description}
                            </span>
                          </div>
                        )}
                        {event.data.requesterId && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Requester:
                            </span>
                            <span className="text-foreground">
                              ID: {event.data.requesterId}
                            </span>
                          </div>
                        )}
                        {event.data.businessLineId && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Business Line:
                            </span>
                            <span className="text-foreground">
                              ID: {event.data.businessLineId}
                            </span>
                          </div>
                        )}
                        {event.data.assignmentGroupId && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Group:
                            </span>
                            <span className="text-foreground">
                              ID: {event.data.assignmentGroupId}
                            </span>
                          </div>
                        )}
                        {event.data.assigneeId && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Assignee:
                            </span>
                            <span className="text-foreground">
                              ID: {event.data.assigneeId}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assignment Event Details */}
                    {event.type === "case.assigned" && event.data && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1 text-xs">
                        {event.data.assigneeId && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Assignee ID:
                            </span>
                            <span className="text-foreground">
                              {event.data.assigneeId}
                            </span>
                          </div>
                        )}
                        {event.data.assigneeName && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Assignee:
                            </span>
                            <span className="text-foreground">
                              {event.data.assigneeName}
                            </span>
                          </div>
                        )}
                        {event.actorName && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Assigned by:
                            </span>
                            <span className="text-foreground">
                              {event.actorName}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Group Assignment Event Details */}
                    {event.type === "case.group.assigned" && event.data && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1 text-xs">
                        {event.data.groupId && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Group ID:
                            </span>
                            <span className="text-foreground">
                              {event.data.groupId}
                            </span>
                          </div>
                        )}
                        {event.actorName && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Changed by:
                            </span>
                            <span className="text-foreground">
                              {event.actorName}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status Change Event Details */}
                    {event.type === "case.status.changed" && event.data && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border/50 space-y-1 text-xs">
                        <div className="flex gap-2">
                          <span className="font-medium text-muted-foreground min-w-[80px]">
                            Previous:
                          </span>
                          <span className="text-foreground">
                            {event.data.before?.status || "Unknown"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-medium text-muted-foreground min-w-[80px]">
                            New:
                          </span>
                          <span className="text-foreground font-medium">
                            {event.data.after?.status || "Unknown"}
                          </span>
                        </div>
                        {event.actorName && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Changed by:
                            </span>
                            <span className="text-foreground">
                              {event.actorName}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Update Event Details */}
                    {event.type === "case.updated" && event.data && (
                      <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border/50 space-y-2 text-xs">
                        <div className="font-semibold text-foreground mb-2">
                          Changes:
                        </div>
                        {event.data.before?.priority !==
                          event.data.after?.priority && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Priority:
                            </span>
                            <span className="text-foreground">
                              {event.data.before?.priority || "None"} →{" "}
                              {event.data.after?.priority || "None"}
                            </span>
                          </div>
                        )}
                        {event.data.before?.title !==
                          event.data.after?.title && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Title:
                            </span>
                            <div className="flex-1 space-y-1">
                              <div className="text-foreground line-through text-muted-foreground">
                                {event.data.before?.title || "None"}
                              </div>
                              <div className="text-foreground font-medium">
                                {event.data.after?.title || "None"}
                              </div>
                            </div>
                          </div>
                        )}
                        {event.data.before?.assigneeId !==
                          event.data.after?.assigneeId && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Assignee:
                            </span>
                            <span className="text-foreground">
                              {event.data.before?.assigneeId || "None"} →{" "}
                              {event.data.after?.assigneeId || "None"}
                            </span>
                          </div>
                        )}
                        {event.data.before?.assignmentGroupId !==
                          event.data.after?.assignmentGroupId && (
                          <div className="flex gap-2">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Group:
                            </span>
                            <span className="text-foreground">
                              {event.data.before?.assignmentGroupId || "None"} →{" "}
                              {event.data.after?.assignmentGroupId || "None"}
                            </span>
                          </div>
                        )}
                        {event.actorName && (
                          <div className="flex gap-2 pt-2 border-t border-border/50">
                            <span className="font-medium text-muted-foreground min-w-[80px]">
                              Updated by:
                            </span>
                            <span className="text-foreground">
                              {event.actorName}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-3">
                      {format(new Date(event.timestamp), "PPp")}
                      {event.actorName &&
                        event.type !== "case.created" &&
                        event.type !== "case.updated" &&
                        event.type !== "case.status.changed" && (
                          <span className="ml-2">• {event.actorName}</span>
                        )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
