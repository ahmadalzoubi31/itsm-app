"use client";

import { useState, useTransition } from "react";
import { Request } from "@/app/(core)/requests/_lib/_types/request.type";
import { submitRequestCardAction } from "../../actions";

export function useRequestCardSubmissionHook() {
  const [isPending, startTransition] = useTransition();
  const [submittedRequest, setSubmittedRequest] = useState<Request | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitRequestCard = async (
    requestCardId: string,
    formData: Record<string, any>
  ) => {
    setError(null);
    setIsSuccess(false);

    try {
      const result = await submitRequestCardAction(requestCardId, formData);

      startTransition(() => {
        if (result.success) {
          setSubmittedRequest(result.data ?? null);
          setIsSuccess(true);
        } else {
          setError(result.error || "Failed to submit request");
        }
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to submit request");
      }

      return result.data;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "An unexpected error occurred";
      setError(errorMessage);
      throw e;
    }
  };

  const reset = () => {
    setSubmittedRequest(null);
    setError(null);
    setIsSuccess(false);
  };

  return {
    submitRequestCard,
    isSubmitting: isPending,
    error,
    submittedRequest,
    reset,
    isSuccess,
    isError: !!error,
  };
}
