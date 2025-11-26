import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { CASES_ENDPOINTS } from "@/lib/api/endpoints/cases";
import {
  Case,
  CaseComment,
  CaseAttachment,
  CaseTimelineEvent,
  CreateCaseDto,
  UpdateCaseDto,
  AssignCaseDto,
  ChangeStatusDto,
  CreateCommentDto,
  ListCasesQuery,
  CaseListResponse,
  CaseCategory,
  CaseSubcategory,
} from "../types";

/**
 * Fetch all cases with optional filters
 */
export async function fetchCases(
  params?: ListCasesQuery
): Promise<CaseListResponse> {
  const queryParams = new URLSearchParams();

  if (params?.status) queryParams.append("status", params.status);
  if (params?.priority) queryParams.append("priority", params.priority);
  if (params?.requesterId)
    queryParams.append("requesterId", params.requesterId);
  if (params?.assigneeId) queryParams.append("assigneeId", params.assigneeId);
  if (params?.assignmentGroupId)
    queryParams.append("assignmentGroupId", params.assignmentGroupId);
  if (params?.businessLineId)
    queryParams.append("businessLineId", params.businessLineId);
  if (params?.q) queryParams.append("q", params.q);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params?.sortDir) queryParams.append("sortDir", params.sortDir);

  const url = `${CASES_ENDPOINTS.base}${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;

  const response = await fetchWithAuth(getBackendUrl(url), {
    credentials: "include",
  });

  // If backend returns array directly, wrap it
  if (Array.isArray(response)) {
    return {
      items: response,
      total: response.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || 20,
      totalPages: Math.ceil(response.length / (params?.pageSize || 20)),
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
 * Fetch a single case by ID
 */
export async function fetchCaseById(id: string): Promise<Case> {
  return fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.byId(id)), {
    credentials: "include",
  });
}

/**
 * Fetch a single case by number
 */
export async function fetchCaseByNumber(number: string): Promise<Case> {
  return fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.byNumber(number)), {
    credentials: "include",
  });
}

/**
 * Create a new case
 */
export async function createCase(payload: CreateCaseDto): Promise<Case> {
  return fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.create), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Update a case
 */
export async function updateCase(
  id: string,
  payload: UpdateCaseDto
): Promise<Case> {
  return fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.update(id)), {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Assign a case to user/group
 */
export async function assignCase(
  id: string,
  payload: AssignCaseDto
): Promise<Case> {
  return fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.assign(id)), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Change case status
 */
export async function changeCaseStatus(
  id: string,
  payload: ChangeStatusDto
): Promise<void> {
  return fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.changeStatus(id)), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch comments for a case
 */
export async function fetchCaseComments(
  caseId: string
): Promise<CaseComment[]> {
  return fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.comments(caseId)), {
    credentials: "include",
  });
}

/**
 * Add a comment to a case
 */
export async function addCaseComment(
  caseId: string,
  payload: CreateCommentDto
): Promise<CaseComment> {
  return fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.addComment(caseId)), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch attachments for a case
 */
export async function fetchCaseAttachments(
  caseId: string
): Promise<CaseAttachment[]> {
  return fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.attachments(caseId)), {
    credentials: "include",
  });
}

/**
 * Upload an attachment to a case
 */
export async function uploadCaseAttachment(
  caseId: string,
  file: File
): Promise<CaseAttachment> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchWithAuth(
    getBackendUrl(CASES_ENDPOINTS.uploadAttachment(caseId)),
    {
      method: "POST",
      credentials: "include",
      body: formData,
    }
  );
}

/**
 * Fetch timeline events for a case
 */
export async function fetchCaseTimeline(
  caseId: string
): Promise<CaseTimelineEvent[]> {
  return fetchWithAuth(getBackendUrl(CASES_ENDPOINTS.timeline(caseId)), {
    credentials: "include",
  });
}

/**
 * Fetch all case categories
 */
export async function fetchCaseCategories(): Promise<CaseCategory[]> {
  return fetchWithAuth(getBackendUrl("/api/v1/case-categories"), {
    credentials: "include",
  });
}

/**
 * Fetch all case subcategories, optionally filtered by category
 */
export async function fetchCaseSubcategories(
  categoryId?: string
): Promise<CaseSubcategory[]> {
  const url = categoryId
    ? `/api/v1/case-subcategories?categoryId=${categoryId}`
    : "/api/v1/case-subcategories";
  return fetchWithAuth(getBackendUrl(url), {
    credentials: "include",
  });
}
