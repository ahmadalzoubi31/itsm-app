"use client";

import { Badge } from "@/components/ui/badge";
import { RequestStatus } from "../_lib/_types/request.type";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className="gap-1">
      <config.icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}

function getStatusConfig(status: RequestStatus) {
  switch (status) {
    case RequestStatus.SUBMITTED:
      return {
        variant: "secondary" as const,
        icon: Circle,
      };
    case RequestStatus.ASSIGNED:
      return {
        variant: "default" as const,
        icon: Clock,
      };
    case RequestStatus.IN_PROGRESS:
      return {
        variant: "default" as const,
        icon: Clock,
      };
    case RequestStatus.RESOLVED:
      return {
        variant: "default" as const,
        icon: CheckCircle,
      };
    case RequestStatus.CLOSED:
      return {
        variant: "outline" as const,
        icon: XCircle,
      };
    default:
      return {
        variant: "secondary" as const,
        icon: Circle,
      };
  }
}
