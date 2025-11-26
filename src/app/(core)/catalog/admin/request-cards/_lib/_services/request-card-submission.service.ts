import { SubmitCatalogRequestDto } from "@/app/(core)/catalog/_lib/_types";
import { Request } from "@/app/(core)/requests/_lib/_types/request.type";
import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { CATALOG_ENDPOINTS } from "@/lib/api/endpoints/catalog";

/**
 * Submit a request from a catalog template
 */
export async function submitRequestCard(
  requestCardId: string,
  formData: Record<string, any>
): Promise<Request> {
  const payload: SubmitCatalogRequestDto = { formData };
  const url = getBackendUrl(CATALOG_ENDPOINTS.submitRequestCard(requestCardId));

  // Log the payload for debugging
  console.log("Submitting request card:", {
    requestCardId,
    formData,
    payload,
    url,
  });

  try {
    const result = await fetchWithAuth(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return result;
  } catch (error) {
    console.error("Failed to submit request card:", {
      requestCardId,
      url,
      error,
    });
    throw error;
  }
}
