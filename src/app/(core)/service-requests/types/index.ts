import { BaseEntity } from "@/types/globals";

export type ServiceRequest = BaseEntity & {
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
};
