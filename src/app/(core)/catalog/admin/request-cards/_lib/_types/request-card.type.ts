import { BusinessLine } from "@/lib/types/globals";

/**
 * Service Card entity from backend
 */
export type RequestCard = {
  id: string;
  serviceId: string;
  key: string;
  name: string;
  jsonSchema: any; // JSON Schema object
  uiSchema?: any; // UI Schema for form rendering hints
  defaults?: Record<string, any>; // Default values
  active: boolean;
  defaultAssignmentGroupId: string;
  businessLineId: string;
  businessLine?: BusinessLine;
  workflowId?: string;
  approvalGroupId?: string;
  approvalType?: "manager" | "direct" | "group"; // Deprecated - use approvalSteps
  approvalConfig?: {
    userId?: string;
    groupId?: string;
    requireAll?: boolean;
  }; // Deprecated - use approvalSteps
  approvalSteps?: Array<{
    order: number;
    type: "manager" | "direct" | "group";
    config?: {
      userId?: string;
      groupId?: string;
      requireAll?: boolean;
    };
  }>;
  createdAt?: string;
  updatedAt?: string;
};
