"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Request } from "../_lib/_types/request.type";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { Calendar, Eye, AlertCircle, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface RequestListItemProps {
  request: Request;
}

export function RequestListItem({ request }: RequestListItemProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-all bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-base line-clamp-1">
                  {request.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {request.description || "No description provided"}
              </p>
            </div>
            <RequestStatusBadge status={request.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={
                request.priority === "Critical" || request.priority === "High"
                  ? "destructive"
                  : "secondary"
              }
              className="text-xs"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {request.priority}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {request.type}
            </Badge>
            {request.businessLine && (
              <Badge variant="secondary" className="text-xs">
                {request.businessLine.name}
              </Badge>
            )}
            <div className="flex items-center text-xs text-muted-foreground ml-auto">
              <Calendar className="h-3 w-3 mr-1" />
              Created{" "}
              {formatDistanceToNow(new Date(request.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" asChild>
          <Link href={`/requests/${request.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Link>
        </Button>
      </div>
    </div>
  );
}
