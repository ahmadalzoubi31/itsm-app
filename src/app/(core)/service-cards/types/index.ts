import { BaseEntity } from "@/types/globals";

// Enums matching backend
export enum ServiceCardStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  RETIRED = "retired",
}

export enum ServiceCardVisibility {
  PUBLIC = "public",
  INTERNAL = "internal",
  RESTRICTED = "restricted",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Entity types matching backend
export type ServiceCategory = BaseEntity & {
  id: string;
  name: string;
  description?: string;
  icon?: string;
};

export type ApprovalWorkflow = BaseEntity & {
  id: string;
  name: string;
  description?: string;
  steps?: any; // JSON field for workflow steps
  isActive: boolean;
};

export type SLA = BaseEntity & {
  id: string;
  name: string;
  targetResponseTime: string; // e.g. "4h"
  targetResolutionTime: string; // e.g. "2d"
  priority: Priority;
};

export type Group = BaseEntity & {
  id: string;
  name: string;
  description?: string;
  // Add other group properties as needed
};

// Legacy types for backward compatibility
export type FormFieldType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "number"
  | "email"
  | "file"
  | "multiselect";

export type ValidationRule = {
  type: "required" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: string | number;
  message: string;
};

export type FormField = {
  id: string;
  label: string;
  type: FormFieldType;
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
};

export type ApprovalStep = {
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
};

export type SLAConfig = {
  responseTime: number; // in hours
  resolutionTime: number; // in hours
  escalationSteps: {
    level: number;
    timeThreshold: number; // in hours
    escalateTo: string; // role or user ID
  }[];
  businessHours?: {
    start: string;
    end: string;
    timezone: string;
    excludeWeekends: boolean;
    holidays?: string[];
  };
};

export type NotificationConfig = {
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
};

export type ServiceCardConfig = {
  customFields: FormField[];
  approvalWorkflow: ApprovalStep[];
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
      assignTo: string; // user ID or group ID
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
};

export type ServiceCard = BaseEntity & {
  id: string;
  name: string;
  description?: string;
  category: ServiceCategory; // Now a full entity
  categoryId?: string; // For form handling
  status: ServiceCardStatus;
  visibility: ServiceCardVisibility;
  estimatedTime?: string;
  price?: string;
  icon?: string;
  isActive: boolean;
  displayOrder?: number;
  tags?: string[];
  requestFormSchema?: any; // Renamed from config
  approvalWorkflow?: ApprovalWorkflow;
  approvalWorkflowId?: string;
  sla?: SLA;
  slaId?: string;
  assignedGroup?: Group;
  assignedGroupId?: string;
  supportContact?: string;

  // Legacy fields for backward compatibility
  workflowId?: string;
  version?: number;
  config?: ServiceCardConfig;
  restrictedToGroups?: string[];
  createdBy?: string;
  lastModifiedBy?: string;
  usage?: {
    totalRequests: number;
    avgCompletionTime: number;
    successRate: number;
    lastUsed?: string;
  };
};

// DTO for creating/updating service cards
export type CreateServiceCardDto = {
  name: string;
  description?: string;
  categoryId?: string;
  status?: ServiceCardStatus;
  visibility?: ServiceCardVisibility;
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
};

export type ServiceCardTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  config: Partial<ServiceCardConfig>;
  isSystem: boolean;
  createdBy: string;
  createdAt: string;
};

export type ServiceCardValidation = {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
  warnings?: {
    field: string;
    message: string;
  }[];
};
