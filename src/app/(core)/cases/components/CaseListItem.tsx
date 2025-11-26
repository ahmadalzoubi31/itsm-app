"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Case } from "../types";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { SLATimers } from "./SLATimer";
import { Calendar, Eye, AlertCircle, User, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface CaseListItemProps {
  case: Case;
}

export function CaseListItem({ case: caseData }: CaseListItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Left side - Main info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono">
                {caseData.number}
              </Badge>
              <CaseStatusBadge status={caseData.status} />
              <Badge
                variant={
                  caseData.priority === "Critical" ||
                  caseData.priority === "High"
                    ? "destructive"
                    : "secondary"
                }
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                {caseData.priority}
              </Badge>
            </div>

            <h3 className="font-semibold text-base line-clamp-1">
              {caseData.title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {caseData.description || "No description provided"}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {caseData.assignee && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>
                    {caseData.assignee.displayName ||
                      `${caseData.assignee.firstName} ${caseData.assignee.lastName}` ||
                      caseData.assignee.email}
                  </span>
                </div>
              )}
              {caseData.assignmentGroup && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{caseData.assignmentGroup.name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(caseData.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>

            {caseData.slaTimers && caseData.slaTimers.length > 0 && (
              <div className="mt-2">
                <SLATimers timers={caseData.slaTimers} maxDisplay={2} />
              </div>
            )}
          </div>

          {/* Right side - Action button */}
          <div className="md:self-center">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/cases/${caseData.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
