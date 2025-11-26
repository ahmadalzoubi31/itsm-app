"use client";

import { use } from "react";
import { useCase } from "../hooks/useCases";
import { useRequestByLinkedCase } from "../../requests/hooks/useRequests";
import { CaseStatusBadge } from "../components/CaseStatusBadge";
import { CaseTimeline } from "../components/CaseTimeline";
import { CaseComments } from "../components/CaseComments";
import { CaseAttachments } from "../components/CaseAttachments";
import { ChangeStatusDialog } from "../components/ChangeStatusDialog";
import { ChangeAssigneeDialog } from "../components/ChangeAssigneeDialog";
import { ChangeAssignmentGroupDialog } from "../components/ChangeAssignmentGroupDialog";
import { SLATimersProgress } from "../components/SLATimer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  AlertCircle,
  Calendar,
  User,
  Users,
  FileText,
  Clock,
  XCircle,
  FolderOpen,
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { useQueryClient } from "@tanstack/react-query";

interface CaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const { case: caseData, isLoading, error } = useCase(id);
  const { request: linkedRequest } = useRequestByLinkedCase(id);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">
                Error Loading Case
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <Button size="sm" variant="outline" className="mt-4" asChild>
              <Link href="/cases">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cases
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !caseData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="px-4 lg:px-8 space-y-4">
          <Skeleton className="h-10 w-40" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            <div className="xl:col-span-8 space-y-6">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="xl:col-span-4">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900";
      case "High":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-900";
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="px-4 lg:px-8 space-y-4">
        {/* Header Navigation */}
        <div className="flex items-center justify-between">
          <Button size="sm" variant="ghost" asChild className="gap-2">
            <Link href="/cases">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <ChangeStatusDialog
              case={caseData}
              onSuccess={() => {
                // Refresh the case data
                queryClient.invalidateQueries({ queryKey: ["case", id] });
              }}
            />
            <ChangeAssignmentGroupDialog
              case={caseData}
              onSuccess={() => {
                // Refresh the case data
                queryClient.invalidateQueries({ queryKey: ["case", id] });
              }}
            />
            <ChangeAssigneeDialog
              case={caseData}
              onSuccess={() => {
                // Refresh the case data
                queryClient.invalidateQueries({ queryKey: ["case", id] });
              }}
            />
            <Button size="sm" variant="outline" asChild>
              <Link href={`/cases/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {caseData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono bg-background">
                {caseData.number}
              </Badge>
              <CaseStatusBadge status={caseData.status} />
              <Badge
                className={cn("gap-1", getPriorityColor(caseData.priority))}
              >
                <AlertCircle className="h-3 w-3" />
                {caseData.priority} Priority
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-8 space-y-6">
            {/* Case Details Card */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">Case Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <h4 className="text-sm font-semibold text-foreground">
                      Description
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground pl-3 border-l-2 border-muted">
                    {caseData.description || "No description provided"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <h4 className="text-sm font-semibold text-foreground">
                      Categorization
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground pl-3 border-l-2 border-muted">
                    {caseData.categoryId && (
                      <div className="flex flex-col lg:flex-row lg:justify-between gap-1 lg:gap-4 py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground font-mono break-all flex-1">
                          {caseData.categoryId}
                        </span>
                      </div>
                    )}
                    {caseData.subcategoryId && (
                      <div className="flex flex-col lg:flex-row lg:justify-between gap-1 lg:gap-4 py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground font-mono break-all flex-1">
                          {caseData.subcategoryId}
                        </span>
                      </div>
                    )}
                  </p>
                </div>

                {linkedRequest?.metadata &&
                  Object.keys(linkedRequest.metadata).length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-primary" />
                          <h4 className="text-sm font-semibold text-foreground">
                            Questions and Answers
                          </h4>
                        </div>
                        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                          {Object.entries(linkedRequest.metadata).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex flex-col lg:flex-row lg:justify-between gap-1 lg:gap-4 py-2 border-b border-border/50 last:border-0"
                              >
                                <span className="text-sm font-medium text-foreground min-w-[180px]">
                                  {key}
                                </span>
                                <span className="text-sm text-muted-foreground font-mono break-all flex-1">
                                  {typeof value === "object"
                                    ? JSON.stringify(value, null, 2)
                                    : String(value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}

                {/* {request.resolution && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        <h4 className="text-sm font-semibold text-foreground">
                          Resolution
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground pl-3 border-l-2 border-green-500">
                        {request.resolution}
                      </p>
                    </div>
                  </>
                )} */}
              </CardContent>
            </Card>

            {/* Comments */}
            <CaseComments caseId={id} requesterId={caseData?.requesterId} />

            {/* Attachments */}
            <CaseAttachments caseId={id} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            {/* SLA Timers Card */}
            {caseData.slaTimers && caseData.slaTimers.length > 0 && (
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <CardTitle className="text-lg">SLA Timers</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Service level agreement tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SLATimersProgress timers={caseData.slaTimers} />
                </CardContent>
              </Card>
            )}

            {/* Information Card */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow xl:top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Information</CardTitle>
                <CardDescription className="text-xs">
                  Case metadata and details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  {caseData.requester && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="p-2 rounded-md bg-background">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Requester
                        </p>
                        <p className="text-sm font-medium">
                          {caseData.requester.displayName ||
                            `${caseData.requester.firstName} ${caseData.requester.lastName}` ||
                            caseData.requester.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {caseData.assignee && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="p-2 rounded-md bg-background">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Assignee
                        </p>
                        <p className="text-sm font-medium">
                          {caseData.assignee.displayName ||
                            `${caseData.assignee.firstName} ${caseData.assignee.lastName}` ||
                            caseData.assignee.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {caseData.assignmentGroup && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="p-2 rounded-md bg-background">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Assignment Group
                        </p>
                        <p className="text-sm font-medium">
                          {caseData.assignmentGroup.name}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="p-2 rounded-md bg-background">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Created
                      </p>
                      <p className="text-xs font-medium">
                        {format(new Date(caseData.createdAt), "PPp")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="p-2 rounded-md bg-background">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Last Updated
                      </p>
                      <p className="text-xs font-medium">
                        {format(new Date(caseData.updatedAt), "PPp")}
                      </p>
                    </div>
                  </div>

                  {caseData.businessLine && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="p-2 rounded-md bg-background">
                        <FolderOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Business Line
                        </p>
                        <p className="text-sm font-medium">
                          {caseData.businessLine.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <CaseTimeline case={caseData} />
          </div>
        </div>
      </div>
    </div>
  );
}
