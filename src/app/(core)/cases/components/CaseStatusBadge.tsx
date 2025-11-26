"use client";

import { Badge } from "@/components/ui/badge";
import { CaseStatus } from "../types";
import {
  CheckCircle,
  Circle,
  Clock,
  XCircle,
  AlertCircle,
  Hourglass,
} from "lucide-react";

interface CaseStatusBadgeProps {
  status: CaseStatus;
}

export function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className="gap-1">
      <config.icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function getStatusConfig(status: CaseStatus) {
  switch (status) {
    case CaseStatus.NEW:
      return {
        variant: "secondary" as const,
        icon: Circle,
        label: "New",
      };
    case CaseStatus.WAITING_APPROVAL:
      return {
        variant: "default" as const,
        icon: Hourglass,
        label: "Waiting Approval",
      };
    case CaseStatus.IN_PROGRESS:
      return {
        variant: "default" as const,
        icon: Clock,
        label: "In Progress",
      };
    case CaseStatus.PENDING:
      return {
        variant: "outline" as const,
        icon: AlertCircle,
        label: "Pending",
      };
    case CaseStatus.RESOLVED:
      return {
        variant: "default" as const,
        icon: CheckCircle,
        label: "Resolved",
      };
    case CaseStatus.CLOSED:
      return {
        variant: "outline" as const,
        icon: XCircle,
        label: "Closed",
      };
    default:
      return {
        variant: "secondary" as const,
        icon: Circle,
        label: status,
      };
  }
}
