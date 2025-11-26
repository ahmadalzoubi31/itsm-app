import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { REQUEST_CARDS_ENDPOINTS } from "@/lib/api/endpoints/catalog";
import {
  RequestCard,
  CreateRequestCardDto,
  UpdateRequestCardDto,
} from "../_types";

/**
 * Fetch all request cards
 */
export async function fetchRequestCards(): Promise<RequestCard[]> {
  return fetchWithAuth(getBackendUrl(REQUEST_CARDS_ENDPOINTS.base));
}

/**
 * Fetch service cards by service ID
 */
export async function fetchRequestCardsByService(
  serviceId: string
): Promise<RequestCard[]> {
  return fetchWithAuth(
    getBackendUrl(REQUEST_CARDS_ENDPOINTS.requestCardsByService(serviceId)),
    {}
  );
}

/**
 * Fetch a single service card by ID
 */
export async function fetchRequestCardById(id: string): Promise<RequestCard> {
  return fetchWithAuth(getBackendUrl(REQUEST_CARDS_ENDPOINTS.byId(id)), {});
}

/**
 * Create a new request card (Admin)
 */
export async function createRequestCard(
  payload: CreateRequestCardDto
): Promise<RequestCard> {
  return fetchWithAuth(getBackendUrl(REQUEST_CARDS_ENDPOINTS.base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Update a request card (Admin)
 */
export async function updateRequestCard(
  id: string,
  payload: UpdateRequestCardDto
): Promise<RequestCard> {
  return fetchWithAuth(
    getBackendUrl(REQUEST_CARDS_ENDPOINTS.updateRequestCard(id)),
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
}

/**
 * Fetch dropdown options for database-connected dropdowns
 */
export async function fetchDropdownOptions(params: {
  entity: string;
  displayField: string;
  valueField: string;
  filters?: Record<string, any>;
}): Promise<Array<{ label: string; value: any }>> {
  const searchParams = new URLSearchParams({
    entity: params.entity,
    displayField: params.displayField,
    valueField: params.valueField,
  });

  if (params.filters) {
    searchParams.append("filters", JSON.stringify(params.filters));
  }

  return fetchWithAuth(
    getBackendUrl(
      `${REQUEST_CARDS_ENDPOINTS.dropdownOptions}?${searchParams.toString()}`
    ),
    {}
  );
}
