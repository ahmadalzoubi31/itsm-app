// Synced with backend entities/DTOs in itsm-app-server

import { User } from "@/app/(core)/iam/users/_lib/_types/user.type";
import type { Column, Table, Row, ColumnDef } from "@tanstack/react-table";
import { Group } from "next/dist/shared/lib/router/utils/route-regex";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdById?: string;
  createdByName?: string;
  updatedById?: string;
  updatedByName?: string;
}

export interface BusinessLine {
  id: string;
  key: string;
  name: string;
  description?: string;
  active: boolean;
}

export enum CaseStatus {
  NEW = "New",
  WAITING_APPROVAL = "WaitingApproval",
  IN_PROGRESS = "InProgress",
  PENDING = "Pending",
  RESOLVED = "Resolved",
  CLOSED = "Closed",
}

export enum CasePriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical",
}

// Case entity (src/modules/case/entities/case.entity.ts)
export interface Case extends BaseEntity {
  number: string;
  title: string;
  description?: string;
  status: CaseStatus;
  priority: CasePriority;
  requesterId?: string;
  assigneeId?: string;
  assignmentGroupId: string;
  businessLineId: string;
  affectedServiceId?: string;
  requestCardId?: string;
}

// Case Comment entity (src/modules/case/entities/case-comment.entity.ts)
export interface CaseComment extends BaseEntity {
  caseId: string;
  body: string;
}

// DTOs (src/modules/case/dto/*.ts)
export interface CreateCaseDto {
  title: string;
  description?: string;
  priority?: CasePriority; // default Medium on server
  requesterId: string;
  assigneeId?: string;
  assignmentGroupId: string;
  businessLineId: string;
  affectedServiceId?: string;
  requestCardId?: string;
}

export interface UpdateCaseDto {
  title?: string;
  description?: string;
  status?: CaseStatus;
  priority?: CasePriority;
  assigneeId?: string;
  assignmentGroupId?: string;
}

export interface ChangeStatusDto {
  status: CaseStatus;
}

export interface AssignCaseDto {
  assigneeId?: string;
  assignmentGroupId?: string;
}

export interface CreateCommentDto {
  body: string;
}

// export interface LoggedUser {
//   id: string;
//   username: string;
//   displayName: string;
//   email?: string;
//   authSource: AuthSource;
//   isActive: boolean;
//   lastLoginAt?: string;
//   permissions: string[];
//   roles: string[]; // Array of role names from backend (additive roles)
// }

// Groups
export enum GroupMemberRoleEnum {
  MEMBER = "member",
  LEADER = "leader",
  ADMIN = "admin",
}

export const GROUP_MEMBER_ROLES = [
  { value: GroupMemberRoleEnum.MEMBER, label: "Member" },
  { value: GroupMemberRoleEnum.LEADER, label: "Leader" },
  { value: GroupMemberRoleEnum.ADMIN, label: "Admin" },
] as const;

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: GroupMemberRoleEnum;
  joinedAt: Date;
  isActive: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone?: string;
  };
}

export interface GroupFilters {
  search?: string;
  interface?: string;
  status?: string;
  isActive?: boolean;
  leaderId?: string;
}

// =====================
// Service Requests
// =====================

export interface ServiceRequest extends BaseEntity {
  serviceId: string;
  serviceName: string;
  title: string;
  priority: string;
  businessJustification: string;
  requiredDate: string;
  additionalDetails: string;
  customFieldValues?: Record<string, any>;
  requestedBy: string;
  requestedDate: string;
  status:
  | "Submitted"
  | "In Progress"
  | "Pending Approval"
  | "Completed"
  | "Rejected";
  progress: number;
  workflowId?: string;
  workflowStatus?:
  | "Not Started"
  | "Running"
  | "Paused"
  | "Completed"
  | "Failed";
  currentStep?: string;
  estimatedCompletion?: string;
}

// =====================
// Service Cards domain
// =====================

export enum RequestCardStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  RETIRED = "retired",
}

export enum RequestCardVisibility {
  PUBLIC = "public",
  INTERNAL = "internal",
  RESTRICTED = "restricted",
}

export enum ServicePriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface ServiceCategory extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface ApprovalWorkflow extends BaseEntity {
  id: string;
  name: string;
  description?: string;
  steps?: any;
  isActive: boolean;
}

export interface SLA extends BaseEntity {
  id: string;
  name: string;
  targetResponseTime: string;
  targetResolutionTime: string;
  priority: ServicePriority;
}

export enum ServiceFormFieldType {
  TEXT = "text",
  TEXTAREA = "textarea",
  SELECT = "select",
  RADIO = "radio",
  CHECKBOX = "checkbox",
  DATE = "date",
  NUMBER = "number",
  EMAIL = "email",
  FILE = "file",
  MULTISELECT = "multiselect",
}

export interface ValidationRule {
  interface: "required" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: string | number;
  message: string;
}

export interface FormField {
  id: string;
  label: string;
  interface: ServiceFormFieldType;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  validationRules: ValidationRule[];
  defaultValue?: string;
  conditional?: {
    field: string;
    operator: "equals" | "notEquals" | "contains";
    value: string;
  };
}

export interface ApprovalSteps {
  id: string;
  name: string;
  approverRole?: string;
  approverUsers?: string[];
  isRequired: boolean;
  order: number;
  autoApprove?: boolean;
  conditions?: {
    field: string;
    operator: string;
    value: string;
  }[];
}

export interface SLAConfig {
  responseTime: number;
  resolutionTime: number;
  escalationSteps: {
    level: number;
    timeThreshold: number;
    escalateTo: string;
  }[];
  businessHours?: {
    start: string;
    end: string;
    timezone: string;
    excludeWeekends: boolean;
    holidays?: string[];
  };
}

export interface NotificationConfig {
  onCreate: {
    notifyRequester: boolean;
    notifyApprovers: boolean;
    customRecipients?: string[];
    template?: string;
  };
  onApproval: {
    notifyRequester: boolean;
    notifyNextApprover: boolean;
    customRecipients?: string[];
    template?: string;
  };
  onCompletion: {
    notifyRequester: boolean;
    notifyStakeholders: boolean;
    customRecipients?: string[];
    template?: string;
  };
  onEscalation: {
    notifyManager: boolean;
    customRecipients?: string[];
    template?: string;
  };
}

export interface RequestCardConfig {
  customFields: FormField[];
  approvalWorkflow: ApprovalSteps[];
  slaConfig: SLAConfig;
  notifications: NotificationConfig;
  autoAssignment?: {
    enabled: boolean;
    rules: {
      condition: {
        field: string;
        operator: string;
        value: string;
      };
      assignTo: string;
    }[];
    fallbackAssignee?: string;
  };
  integrations?: {
    externalSystems?: {
      system: string;
      endpoint: string;
      method: string;
      headers?: Record<string, string>;
      body?: string;
      triggerOn: "create" | "approve" | "complete" | "all";
    }[];
  };
}

export interface RequestCard extends BaseEntity {
  name: string;
  description?: string;
  category?: ServiceCategory;
  categoryId?: string;
  status?: RequestCardStatus;
  visibility?: RequestCardVisibility;
  estimatedTime?: string;
  price?: string;
  icon?: string;
  isActive: boolean;
  displayOrder?: number;
  tags?: string[];
  requestFormSchema?: any;
  approvalWorkflow?: ApprovalWorkflow;
  approvalWorkflowId?: string;
  sla?: SLA;
  slaId?: string;
  assignedGroup?: Group | null;
  assignedGroupId?: string;
  supportContact?: string;
  workflowId?: string;
  version?: number;
  config?: RequestCardConfig;
  restrictedToGroups?: string[];
  createdBy?: string;
  lastModifiedBy?: string;
  usage?: {
    totalRequests: number;
    avgCompletionTime: number;
    successRate: number;
    lastUsed?: string;
  };
}

export interface CreateRequestCardDto {
  name: string;
  description?: string;
  categoryId?: string;
  status?: RequestCardStatus;
  visibility?: RequestCardVisibility;
  estimatedTime?: string;
  price?: string;
  icon?: string;
  isActive?: boolean;
  displayOrder?: number;
  tags?: string[];
  requestFormSchema?: Record<string, any>;
  approvalWorkflowId?: string;
  slaId?: string;
  assignedGroupId?: string;
  supportContact?: string;
}

export interface RequestCardTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  config: Partial<RequestCardConfig>;
  isSystem: boolean;
  createdBy: string;
  createdAt: string;
}

export interface RequestCardValidation {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
  warnings?: {
    field: string;
    message: string;
  }[];
}
// =====================
// Common UI Component Props
// =====================

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: any[];
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: any[];
  onRowClick?: (row: TData) => void;
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  refetch?: () => Promise<any>;
}

export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export interface DataTableViewOptionsProps<TData, TFunc = any> {
  table: Table<TData>;
  refetch?: () => Promise<TFunc>;
}

// =====================
// Chart types
// =====================

export interface ChartConfig {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  );
}

// =====================
// Email Settings domain
// =====================

export enum EmailProtocolEnum {
  SMTP = "SMTP",
  IMAP = "IMAP",
  POP3 = "POP3",
}

export enum EmailSecurityEnum {
  NONE = "NONE",
  SSL_TLS = "SSL_TLS",
  STARTTLS = "STARTTLS",
}

export interface OutgoingEmailEngine {
  enabled: boolean;
  protocol: EmailProtocolEnum;
  host: string;
  port: number;
  secure: EmailSecurityEnum;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  timeout: number;
  connectionTimeout: number;
  maxConnections: number;
  rateLimitPerSecond: number;
}

export interface IncomingEmailEngine {
  enabled: boolean;
  protocol: EmailProtocolEnum;
  host: string;
  port: number;
  secure: EmailSecurityEnum;
  username: string;
  password: string;
  pollInterval: number;
  autoProcessIncidents: boolean;
  autoAssignTo?: string;
  defaultPriority: string;
  emailToIncidentMapping: {
    subjectRegex: string;
    bodyRegex: string;
    categoryMapping: string;
    priorityMapping: string;
  }[];
}

export interface NotificationSettings {
  enabled: boolean;
  notificationTypes: string[];
  defaultRecipients: string[];
  urgentRecipients: string[];
  ccRecipients: string[];
  bccRecipients: string[];
  subjectPrefix: string;
  includeAttachments: boolean;
  maxAttachmentSize: number;
  retryAttempts: number;
  retryDelay: number;
  batchSize: number;
  throttleLimit: number;
}

export interface EmailTemplate {
  name: string;
  interface: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: string[];
  isActive: boolean;
  language: string;
}

export interface EmailSettings {
  outgoing: OutgoingEmailEngine;
  incoming: IncomingEmailEngine;
  templates: EmailTemplate[];
  testEmail: string;
  lastTestResult?: {
    success: boolean;
    timestamp: Date;
    message: string;
    details?: any;
  };
}

export interface EmailTestResult {
  success: boolean;
  message: string;
  details?: {
    messageId?: string;
    response?: string;
    error?: string;
    duration?: number;
  };
}

export interface EmailStatistics {
  totalSent: number;
  totalFailed: number;
  last24Hours: number;
  last7Days: number;
  lastMonth: number;
  deliveryRate: number;
  averageDeliveryTime: number;
  lastSentAt?: Date;
}

// =====================
// LDAP Settings domain
// =====================

export enum ProtocolEnum {
  SMTP = "SMTP",
  IMAP = "IMAP",
  POP3 = "POP3",
}
export enum SearchScopeEnum {
  BASE = "BASE",
  ONE_LEVEL = "ONE_LEVEL",
  SUBTREE = "SUBTREE",
}
export enum SyncStatusEnum {
  PENDING = "PENDING",
  SYNCING = "SYNCING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
export enum FrequencyEnum {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
}

export interface LdapSettings {
  server: string;
  port: number;
  protocol: ProtocolEnum;
  searchBase: string;
  bindDn: string;
  bindPassword: string;
  searchScope: SearchScopeEnum;
  searchFilter: string;
  attributes: string;
  useSSL: boolean;
  validateCert: boolean;
}

export interface SyncSettings {
  enabled: boolean;
  frequency: FrequencyEnum;
  syncTime: string;
  timezone: string;
  retryAttempts: number;
  retryInterval: number;
  fullSyncInterval: number;
  syncMinute?: number;
  daysOfWeek?: number[];
  daysOfMonth?: number[];
}

export interface SyncHistory {
  id: string;
  timestamp: Date;
  status: SyncStatusEnum;
  details: string;
  usersFetched?: number;
  duration?: number;
}

export enum StagedUserStatusEnum {
  PENDING = "PENDING",
  SYNCING = "SYNCING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface StagedUser extends BaseEntity {
  cn?: string;
  mail?: string;
  sAMAccountName?: string;
  displayName?: string;
  department?: string;
  givenName?: string;
  sn?: string;
  title?: string;
  mobile?: string;
  userPrincipalName?: string;
  objectGUID: string;
  manager?: string;
  additionalAttributes?: Record<string, any>;
  status: StagedUserStatusEnum;
  selected: boolean;
}

export enum TimezoneValue {
  UTC = "UTC",
  GMT = "GMT",
  EST = "EST",
  CST = "CST",
  MST = "MST",
  PST = "PST",
}

// =====================
// Component Props Interfaces
// =====================

// Groups Components
export interface GroupFormProps {
  isEdit?: boolean;
}

export interface GroupMembersDialogProps {
  group: Group;
  trigger?: React.ReactNode;
}

export interface UserSearchProps {
  onUserSelect: (user: UserSearchUser, role: GroupMemberRoleEnum) => void;
  existingUserIds: string[];
  isLoading?: boolean;
}

export interface UserSearchUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// Incidents Components
export interface IncidentFormProps {
  onSubmit: (data: CreateCaseDto) => Promise<void>;
  loading?: boolean;
}

export interface IncidentListProps {
  incidents: any[];
  loading?: boolean;
  onFiltersChange?: (filters: any) => void;
}

export interface BulkReassignmentData {
  assignedToId?: string;
  assignmentGroup?: string;
  reason: string;
}

export interface KBArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  relevanceScore: number;
  url?: string;
  lastUpdated: Date;
}

export interface KnowledgeBaseSectionProps {
  incidentTitle: string;
  incidentDescription: string;
  incidentCategory: string;
}

// Service Cards Components
export interface RequestCardWizardProps {
  requestCard?: RequestCard;
  onSave: (requestCard: Partial<RequestCard>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export interface RequestCardBuilderProps {
  requestCard?: RequestCard;
  onSave: (requestCard: Partial<RequestCard>) => void;
  onCancel: () => void;
  isOpen: boolean;
  trigger?: React.ReactNode;
}

export interface RequestCardPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  requestCard: any;
}

export interface FormFieldBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

export interface ApprovalWorkflowBuilderProps {
  workflow: ApprovalSteps[];
  onChange: (workflow: ApprovalSteps[]) => void;
}

export interface SLAConfigBuilderProps {
  slaConfig: SLAConfig;
  onChange: (slaConfig: SLAConfig) => void;
}

export interface NotificationConfigBuilderProps {
  notifications: NotificationConfig;
  onChange: (notifications: NotificationConfig) => void;
}

// Service Requests Components
export interface NewServiceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: RequestCard[];
  selectedServiceId?: string | null;
  onRequestCreated?: () => void;
}

export interface MyRequestsListProps {
  requests: any[];
  isLoading?: boolean;
}

export interface ServiceCatalogProps {
  services: RequestCard[];
  onRequestService: (serviceId: string) => void;
  isLoading?: boolean;
}

export interface ServiceRequestsFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  availableCategories?: string[];
}

// Settings Components
export interface SettingsHeaderProps {
  title: string;
  description: string;
}

export interface SettingsTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export interface SettingToggleProps {
  id: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface IntegrationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

export interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Email Settings Components
export interface IncomingEmailFormProps {
  onSuccess?: (settings: IncomingEmailEngine) => void;
}

export interface EmailTestFormProps {
  onTestResult?: (result: EmailTestResult) => void;
}

export interface NotificationSettingsFormProps {
  onSuccess?: (settings: NotificationSettings) => void;
}

export interface RecipientManagerProps {
  recipients: string[];
  onAdd: (email: string) => void;
  onRemove: (email: string) => void;
  placeholder?: string;
}

export interface EmailProviderFormProps {
  onSuccess?: (settings: EmailSettings) => void;
}

export interface EmailStatisticsCardProps {
  statistics: any;
  loading: boolean;
}

// LDAP Settings Components
export interface SyncScheduleFormProps {
  form: UseFormReturn<SyncSettings>;
  onSave: (values: SyncSettings) => void;
  isSaving?: boolean;
}

export interface SyncHistoryProps {
  history: SyncHistory[];
  isLoading?: boolean;
}

// Workflow Components
export interface StepConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: any;
  onSave: (updatedStep: any) => void;
}

export interface StepLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStep: (step: any) => void;
}

export interface StepTypeConfigProps {
  stepType: string;
  stepData: any;
  onDataChange: (data: any) => void;
}

// DataTable Components (additional variants)
export interface DataTablePropsExtended<TData, TValue, TFunc = any> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch: () => Promise<TFunc>;
  isLoading?: boolean;
}

// Basic DataTable props (for simple tables without refetch)
export interface DataTableBasicProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

// DataTable props with optional refetch (for groups)
export interface DataTableWithRefetchProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch?: () => Promise<any>;
  isLoading?: boolean;
}

// DataTable props with row selection (for LDAP staged users)
export interface DataTableWithRowSelectionProps<
  TData extends { objectGUID: string },
  TValue,
  TFunc
> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch: () => Promise<TFunc>;
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (rowSelection: Record<string, boolean>) => void;
}

// LDAP Sync Components
export interface SyncHistoryCardProps {
  syncHistoryList: SyncHistory[];
}

export interface SyncStatusCardProps {
  form: UseFormReturn<SyncSettings>;
  syncHistoryList: SyncHistory[];
}
