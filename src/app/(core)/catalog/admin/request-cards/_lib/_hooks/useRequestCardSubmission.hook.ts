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

    startTransition(async () => {
      const result = await submitRequestCardAction(requestCardId, formData);

      if (result.success) {
        setSubmittedRequest(result.data ?? null);
        setIsSuccess(true);
      } else {
        setError(result.error || "Failed to submit request");
      }
    });
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
