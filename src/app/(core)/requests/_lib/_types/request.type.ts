import { BusinessLine } from "@/lib/types/globals";

/**
 * Request entity from backend
 */
export type Request = {
  id: string;
  number: string;
  title: string;
  description?: string;
  type: RequestType;
  status: RequestStatus;
  priority: RequestPriority;
  businessLineId: string;
  businessLine?: BusinessLine;
  affectedServiceId?: string;
  requestCardId?: string;
  requestCard?: {
    id: string;
    name: string;
    approvalSteps?: Array<{
      order: number;
      type: string;
    }>;
  };
  requesterId?: string;
  assigneeId?: string;
  assignmentGroupId?: string;
  caseId?: string;
  linkedCaseId?: string;
  linkedCase?: {
    id: string;
    number: string;
    title: string;
    status: string;
    assigneeId?: string;
    assignee?: {
      id: string;
      displayName?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    category?: {
      id: string;
      key: string;
      name: string;
      description?: string;
      active: boolean;
    };
    subcategory?: {
      id: string;
      key: string;
      name: string;
      description?: string;
      active: boolean;
      categoryId: string;
    };
  };
  approvalRequests?: Array<{
    id: string;
    status: "pending" | "approved" | "rejected";
    approvedAt?: string;
    rejectedAt?: string;
    justification?: string;
    approver?: {
      id: string;
      displayName?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    createdAt?: string;
    updatedAt?: string;
  }>;
  metadata?: Record<string, any>;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Request comment entity
 */
export type RequestComment = {
  id: string;
  requestId: string;
  body: string;
  isPrivate: boolean;
  createdAt: string;
  createdById?: string;
  createdByName?: string;
};

/**
 * Request attachment entity
 */
export type RequestAttachment = {
  id: string;
  requestId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  createdAt: string;
  createdById: string;
  createdByName: string;
};

/**
 * Request type enum
 */
export enum RequestType {
  SERVICE_REQUEST = "ServiceRequest",
  INCIDENT = "Incident",
}

/**
 * Request status enum
 */
export enum RequestStatus {
  SUBMITTED = "Submitted",
  WAITING_APPROVAL = "WaitingApproval",
  ASSIGNED = "Assigned",
  IN_PROGRESS = "InProgress",
  RESOLVED = "Resolved",
  CLOSED = "Closed",
}

/**
 * Request priority enum
 */
export enum RequestPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
}
