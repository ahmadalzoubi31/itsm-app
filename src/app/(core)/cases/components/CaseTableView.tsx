"use client";

import { Case } from "../types";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { SLATimers } from "./SLATimer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface CaseTableViewProps {
  cases: Case[];
}

export function CaseTableView({ cases }: CaseTableViewProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>SLA</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground"
              >
                No cases found
              </TableCell>
            </TableRow>
          ) : (
            cases.map((caseData) => (
              <TableRow key={caseData.id}>
                <TableCell className="font-mono font-medium">
                  {caseData.number}
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="line-clamp-1">{caseData.title}</div>
                </TableCell>
                <TableCell>
                  <CaseStatusBadge status={caseData.status} />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      caseData.priority === "Critical" ||
                      caseData.priority === "High"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {caseData.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {caseData.slaTimers && caseData.slaTimers.length > 0 ? (
                    <SLATimers timers={caseData.slaTimers} maxDisplay={1} />
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {caseData.assignee
                    ? caseData.assignee.displayName ||
                      `${caseData.assignee.firstName} ${caseData.assignee.lastName}` ||
                      caseData.assignee.email
                    : "-"}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(caseData.createdAt), "PP")}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/cases/${caseData.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
