import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { REQUESTS_ENDPOINTS } from "@/lib/api/endpoints/requests";
import {
  Request,
  CreateRequestDto,
  RequestComment,
  RequestAttachment,
  CreateCommentDto,
} from "../_lib/_types";

/**
 * Fetch all requests for the current user
 */
export async function fetchRequests(params?: {
  page?: number;
  pageSize?: number;
  type?: string;
}): Promise<{
  items: Request[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params?.type) queryParams.append("type", params.type);

  const url = `${REQUESTS_ENDPOINTS.base}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetchWithAuth(getBackendUrl(url));
  console.log("🚀 ~ fetchRequests ~ response:", response);

  // If backend returns array directly, wrap it
  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      totalPages: Math.ceil(response.length / (params?.pageSize || 10)),
    };
  }

  return {
    items: response.items,
    total: response.total,
    page: response.page,
    pageSize: response.pageSize,
    totalPages: response.totalPages,
  };
}

/**
 * Fetch a single request by ID
 */
export async function fetchRequestById(id: string): Promise<Request> {
  return fetchWithAuth(getBackendUrl(REQUESTS_ENDPOINTS.byId(id)));
}

/**
 * Fetch a request by linked case ID
 */
export async function fetchRequestByLinkedCaseId(
  caseId: string
): Promise<Request> {
  return fetchWithAuth(getBackendUrl(REQUESTS_ENDPOINTS.byLinkedCase(caseId)));
}

/**
 * Create a new request
 */
export async function createRequest(
  payload: CreateRequestDto
): Promise<Request> {
  return fetchWithAuth(getBackendUrl(REQUESTS_ENDPOINTS.create), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Update a request
 */
export async function updateRequest(
  id: string,
  payload: Partial<CreateRequestDto>
): Promise<Request> {
  return fetchWithAuth(getBackendUrl(REQUESTS_ENDPOINTS.update(id)), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch comments for a request
 */
export async function fetchRequestComments(
  requestId: string
): Promise<RequestComment[]> {
  return fetchWithAuth(getBackendUrl(REQUESTS_ENDPOINTS.comments(requestId)));
}

/**
 * Add a comment to a request
 */
export async function addRequestComment(
  requestId: string,
  payload: CreateCommentDto
): Promise<RequestComment> {
  return fetchWithAuth(
    getBackendUrl(REQUESTS_ENDPOINTS.addComment(requestId)),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
}

/**
 * Fetch attachments for a request
 */
export async function fetchRequestAttachments(
  requestId: string
): Promise<RequestAttachment[]> {
  return fetchWithAuth(
    getBackendUrl(REQUESTS_ENDPOINTS.attachments(requestId))
  );
}

/**
 * Upload an attachment to a request
 */
export async function uploadRequestAttachment(
  requestId: string,
  file: File
): Promise<RequestAttachment> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchWithAuth(
    getBackendUrl(REQUESTS_ENDPOINTS.uploadAttachment(requestId)),
    {
      method: "POST",
      body: formData,
    }
  );
}
