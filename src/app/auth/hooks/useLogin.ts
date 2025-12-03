"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "../services";
import type { LoginDto } from "../types";

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: Response) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const mutation = useMutation({
    mutationFn: (dto: LoginDto) => login(dto),
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: Response) => {
      options?.onError?.(error);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

