"use client";

import { use } from "react";
import { useRequest } from "../hooks/useRequests";
import { RequestStatusBadge } from "../components/RequestStatusBadge";
import { RequestTimeline } from "../components/RequestTimeline";
import { RequestComments } from "../components/RequestComments";
import { RequestAttachments } from "../components/RequestAttachments";
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
  CheckCircle2,
  XCircle,
  FolderOpen,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const { id } = use(params);
  const { request, isLoading, error } = useRequest(id);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">
                Error Loading Request
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <Button size="sm" variant="outline" className="mt-4" asChild>
              <Link href="/requests">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Requests
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !request) {
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
        <div className="flex items-center gap-4">
          <Button size="sm" variant="ghost" asChild className="gap-2">
            <Link href="/requests">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* Title Section with Enhanced Design */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {request.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono bg-background">
                {request.number}
              </Badge>
              <RequestStatusBadge status={request.status} />
              <Badge
                className={cn("gap-1", getPriorityColor(request.priority))}
              >
                <AlertCircle className="h-3 w-3" />
                {request.priority} Priority
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-8 space-y-6">
            {/* Request Details Card */}
            <Card className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <CardTitle className="text-lg">Request Details</CardTitle>
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
                    {request.description || "No description provided"}
                  </p>
                </div>

                {request.metadata &&
                  Object.keys(request.metadata).length > 0 && (
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
                          {request.linkedCase?.category && (
                            <div className="flex flex-col lg:flex-row lg:justify-between gap-1 lg:gap-4 py-2 border-b border-border/50">
                              <span className="text-sm font-medium text-foreground min-w-[180px]">
                                Category
                              </span>
                              <span className="text-sm text-muted-foreground font-mono break-all flex-1">
                                {request.linkedCase.category.name}
                              </span>
                            </div>
                          )}
                          {request.linkedCase?.subcategory && (
                            <div className="flex flex-col lg:flex-row lg:justify-between gap-1 lg:gap-4 py-2 border-b border-border/50">
                              <span className="text-sm font-medium text-foreground min-w-[180px]">
                                Subcategory
                              </span>
                              <span className="text-sm text-muted-foreground font-mono break-all flex-1">
                                {request.linkedCase.subcategory.name}
                              </span>
                            </div>
                          )}
                          {Object.entries(request.metadata).map(
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

                {request.resolution && (
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
                )}
              </CardContent>
            </Card>

            {/* Comments */}
            <RequestComments requestId={id} />

            {/* Attachments */}
            <RequestAttachments requestId={id} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-4 space-y-6">
            <Card className="border shadow-sm hover:shadow-md transition-shadow xl:top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Information</CardTitle>
                <CardDescription className="text-xs">
                  Request metadata and details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  {request.linkedCase && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="p-2 rounded-md bg-background">
                        <FolderOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Linked Case
                        </p>
                        <div className="flex flex-col gap-1">
                          <Link
                            href={`/cases/${request.linkedCase.id}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            {request.linkedCase.number}
                          </Link>
                        </div>
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
                        {format(new Date(request.createdAt), "PPp")}
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
                        {format(new Date(request.updatedAt), "PPp")}
                      </p>
                    </div>
                  </div>

                  {request.businessLineId && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="p-2 rounded-md bg-background">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Business Line
                        </p>
                        <p className="text-sm font-medium">
                          {request.businessLineId}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <RequestTimeline request={request} />
          </div>
        </div>
      </div>
    </div>
  );
}
