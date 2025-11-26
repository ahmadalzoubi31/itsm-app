import { RequestType, RequestPriority } from "./request.type";

/**
 * DTO for creating a request
 */
export type CreateRequestDto = {
  title: string;
  description?: string;
  type: RequestType;
  priority: RequestPriority;
  businessLineId: string;
  affectedServiceId?: string;
  requestCardId?: string;
  metadata?: Record<string, any>;
};
