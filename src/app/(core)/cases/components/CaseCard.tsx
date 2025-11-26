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
import { Case } from "../types";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { SLATimers } from "./SLATimer";
import { Calendar, Eye, AlertCircle, User, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface CaseCardProps {
  case: Case;
}

export function CaseCard({ case: caseData }: CaseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {caseData.number}
              </Badge>
            </div>
            <CardTitle className="text-lg line-clamp-1">
              {caseData.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {caseData.description || "No description provided"}
            </CardDescription>
          </div>
          <CaseStatusBadge status={caseData.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={
              caseData.priority === "Critical" || caseData.priority === "High"
                ? "destructive"
                : "secondary"
            }
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            {caseData.priority}
          </Badge>
          {caseData.businessLine && (
            <Badge variant="outline">{caseData.businessLine.name}</Badge>
          )}
        </div>

        {caseData.slaTimers && caseData.slaTimers.length > 0 && (
          <SLATimers timers={caseData.slaTimers} maxDisplay={2} />
        )}

        <div className="space-y-2 text-sm text-muted-foreground">
          {caseData.assignee && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>
                {caseData.assignee.displayName ||
                  `${caseData.assignee.firstName} ${caseData.assignee.lastName}` ||
                  caseData.assignee.email}
              </span>
            </div>
          )}
          {caseData.assignmentGroup && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{caseData.assignmentGroup.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Created{" "}
            {formatDistanceToNow(new Date(caseData.createdAt), {
              addSuffix: true,
            })}
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href={`/cases/${caseData.id}`}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
