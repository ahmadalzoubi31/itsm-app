// src/app/(core)/catalog/admin/request-cards/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { submitRequestCard } from "./_lib/_services/request-card-submission.service";

const REQUEST_CARDS_PATH = "/catalog/admin/request-cards";

/**
 * Server action to submit a request from a request card
 */
export async function submitRequestCardAction(
  requestCardId: string,
  formData: Record<string, any>
) {
  try {
    const result = await submitRequestCard(requestCardId, formData);

    // Revalidate the requests page to show the new request
    revalidatePath("/requests");

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to submit request card:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit request",
    };
  }
}
