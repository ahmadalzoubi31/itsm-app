"use client";

import { useState } from "react";
import { refreshToken as refreshTokenService } from "../services";
import type { RefreshTokenDto } from "../interfaces";

export function useRefreshToken() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async (dto: RefreshTokenDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await refreshTokenService(dto);
      if (res.ok) {
        return { success: true };
      } else {
        setError("Session could not be refreshed. Please log in again.");
        return { success: false, error: "Session could not be refreshed" };
      }
    } catch (err) {
      const errorMessage = "Network error. Please log in again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { refresh, loading, error };
}

