"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RequestStatusBadge } from "./RequestStatusBadge";
import { Calendar, Eye, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Request } from "../_lib/_types/request.type";

interface RequestCardProps {
  request: Request;
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg line-clamp-1">
                {request.title}
              </CardTitle>
              {request.number && (
                <Badge variant="outline" className="font-mono text-xs">
                  {request.number}
                </Badge>
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {request.description || "No description provided"}
            </CardDescription>
          </div>
          <RequestStatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={
              request.priority === "Critical" || request.priority === "High"
                ? "destructive"
                : "secondary"
            }
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            {request.priority}
          </Badge>
          <Badge variant="outline">{request.type}</Badge>
          {request.businessLine && (
            <Badge variant="secondary">{request.businessLine.name}</Badge>
          )}
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          Created{" "}
          {formatDistanceToNow(new Date(request.createdAt), {
            addSuffix: true,
          })}
        </div>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/requests/${request.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
