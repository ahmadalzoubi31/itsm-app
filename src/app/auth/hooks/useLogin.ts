"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login } from "../services";
import type { LoginDto } from "../interfaces";

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: Response) => void;
}

export function useLogin(options?: UseLoginOptions) {
  const router = useRouter();

  const handleLogin = async (dto: LoginDto) => {
    const promise = () => login(dto);

    toast.promise(promise, {
      loading: "Loading...",
      success: (data) => {
        options?.onSuccess?.();
        router.push("/");
        return `Signed in successfully!`;
      },
      error: (error: Response) => {
        options?.onError?.(error);
        return `Sign in failed, ${error.statusText}`;
      },
    });
  };

  return { login: handleLogin };
}

