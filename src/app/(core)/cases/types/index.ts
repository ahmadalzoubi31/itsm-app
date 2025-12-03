import { BusinessLine } from "@/app/(core)/settings/services/business-line.service";
import { Service } from "../../catalog/admin/services/_lib/_types";
import { RequestCard } from "../../catalog/admin/request-cards/_lib/_types";

/**
 * Case status enum
 */
export enum CaseStatus {
  NEW = "New",
  WAITING_APPROVAL = "WaitingApproval",
  IN_PROGRESS = "InProgress",
  PENDING = "Pending",
  RESOLVED = "Resolved",
  CLOSED = "Closed",
}

/**
 * Case priority enum
 */
export enum CasePriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
}

/**
 * User reference (simplified)
 */
export interface UserReference {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  displayName?: string;
}

/**
 * Group reference (simplified)
 */
export interface GroupReference {
  id: string;
  name: string;
  description?: string;
}

/**
 * Case Category entity
 */
export interface CaseCategory {
  id: string;
  key: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Case Subcategory entity
 */
export interface CaseSubcategory {
  id: string;
  key: string;
  name: string;
  description?: string;
  active: boolean;
  categoryId: string;
  category?: CaseCategory;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * SLA Timer entity
 */
export interface SlaTimer {
  id: string;
  caseId: string;
  targetId: string;
  target?: {
    id: string;
    key: string;
    name: string;
    goalMs: number;
  };
  startedAt: string;
  stoppedAt?: string;
  breachedAt?: string;
  lastTickAt?: string;
  remainingMs: number;
  status: "Running" | "Stopped" | "Breached" | "Paused" | "Met";
  pausedAt?: string;
  resumedAt?: string;
  totalPausedMs: number;
}

/**
 * Case entity from backend
 */
export interface Case {
  id: string;
  number: string;
  title: string;
  description?: string;
  status: CaseStatus;
  priority: CasePriority;

  // Relationships
  requesterId?: string;
  requester?: UserReference;
  categoryId: string;
  category?: CaseCategory;
  subcategoryId: string;
  subcategory?: CaseSubcategory;
  assigneeId?: string;
  assignee?: UserReference;
  assignmentGroupId?: string;
  assignmentGroup?: GroupReference;
  businessLineId: string;
  businessLine?: BusinessLine;
  affectedServiceId?: string;
  affectedService?: Service;
  requestCardId?: string;
  requestCard?: RequestCard;

  // SLA Timers
  slaTimers?: SlaTimer[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdById?: string;
  createdByName?: string;
  updatedById?: string;
  updatedByName?: string;
}

/**
 * Case comment entity
 */
export interface CaseComment {
  id: string;
  caseId: string;
  body: string;
  isPrivate: boolean;
  createdAt: string;
  createdById?: string;
  createdByName?: string;
}

/**
 * Case attachment entity
 */
export interface CaseAttachment {
  id: string;
  caseId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  storagePath: string;
  createdAt: string;
  createdById: string;
  createdByName: string;
}

/**
 * DTO for creating a case
 */
export interface CreateCaseDto {
  title: string;
  description?: string;
  priority: CasePriority;
  requesterId: string;
  assigneeId?: string;
  assignmentGroupId: string;
  businessLineId: string;
  categoryId: string;
  subcategoryId: string;
  affectedServiceId?: string;
  requestCardId?: string;
}

/**
 * DTO for updating a case
 */
export interface UpdateCaseDto {
  title?: string;
  description?: string;
  status?: CaseStatus;
  priority?: CasePriority;
  assigneeId?: string;
  assignmentGroupId?: string;
  categoryId?: string;
  subcategoryId?: string;
}

/**
 * DTO for assigning a case
 */
export interface AssignCaseDto {
  assigneeId?: string;
  assignmentGroupId?: string;
}

/**
 * DTO for changing case status
 */
export interface ChangeStatusDto {
  status: CaseStatus;
}

/**
 * DTO for adding a comment
 */
export interface CreateCommentDto {
  body: string;
  isPrivate?: boolean;
}

/**
 * Query params for listing cases
 */
export interface ListCasesQuery {
  status?: CaseStatus;
  priority?: CasePriority;
  requesterId?: string;
  assigneeId?: string;
  assignmentGroupId?: string;
  businessLineId?: string;
  q?: string; // search query
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "updatedAt" | "priority" | "status";
  sortDir?: "ASC" | "DESC";
}

/**
 * Paginated response for cases list
 */
export interface CaseListResponse {
  items: Case[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Case status options for UI
 */
export const CASE_STATUS_OPTIONS = [
  { value: CaseStatus.NEW, label: "New" },
  { value: CaseStatus.WAITING_APPROVAL, label: "Waiting Approval" },
  { value: CaseStatus.IN_PROGRESS, label: "In Progress" },
  { value: CaseStatus.PENDING, label: "Pending" },
  { value: CaseStatus.RESOLVED, label: "Resolved" },
  { value: CaseStatus.CLOSED, label: "Closed" },
];

/**
 * Case priority options for UI
 */
export const CASE_PRIORITY_OPTIONS = [
  { value: CasePriority.LOW, label: "Low" },
  { value: CasePriority.MEDIUM, label: "Medium" },
  { value: CasePriority.HIGH, label: "High" },
  { value: CasePriority.CRITICAL, label: "Critical" },
];

/**
 * Case timeline event
 */
export interface CaseTimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string | Date;
  actorId?: string;
  actorName?: string;
  data?: any;
}
