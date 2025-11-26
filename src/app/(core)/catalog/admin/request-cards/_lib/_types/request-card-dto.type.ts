/**
 * DTO for creating a request card
 */
export interface CreateRequestCardDto {
  serviceId: string;
  key: string;
  name: string;
  jsonSchema: any;
  uiSchema?: any;
  defaults?: any;
  defaultAssignmentGroupId: string;
  workflowId?: string;
  active?: boolean;
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
}

/**
 * DTO for updating a request card
 */
export interface UpdateRequestCardDto {
  key?: string;
  name?: string;
  jsonSchema?: any;
  uiSchema?: any;
  defaults?: any;
  defaultAssignmentGroupId?: string;
  workflowId?: string;
  active?: boolean;
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
}
