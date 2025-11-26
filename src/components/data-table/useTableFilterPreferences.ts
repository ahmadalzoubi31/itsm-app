"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getFilterPreferences,
  upsertFilterPreferences,
} from "@/lib/services/user-preferences.service";
import type { FacetedFilterConfig } from "./types";

const STORAGE_PREFIX = "table-filter-prefs-";

interface UseTableFilterPreferencesOptions<TData> {
  preferenceKey?: string;
  defaultFilters: FacetedFilterConfig<TData>[];
}

export function useTableFilterPreferences<TData>({
  preferenceKey,
  defaultFilters,
}: UseTableFilterPreferencesOptions<TData>) {
  const storageKey = preferenceKey ? `${STORAGE_PREFIX}${preferenceKey}` : null;

  // Always start with defaults to match server render (prevents hydration mismatch)
  const [filters, setFilters] = useState<FacetedFilterConfig<TData>[]>(defaultFilters);
  const hasLoadedRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load preferences from localStorage first (fast), then backend (authoritative)
  useEffect(() => {
    if (typeof window === "undefined" || !preferenceKey || hasLoadedRef.current) return;

    const loadPreferences = async () => {
      // 1. Try localStorage first for immediate UI feedback
      try {
        if (storageKey) {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const parsed = JSON.parse(saved) as FacetedFilterConfig<TData>[];
            // Use saved filters if they exist
            if (Array.isArray(parsed) && parsed.length > 0) {
              setFilters(parsed);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load filter preferences from localStorage:", error);
      }

      // 2. Then fetch from backend to sync/update (silently fail if endpoint doesn't exist)
      try {
        const backendPrefs = await getFilterPreferences<TData>(preferenceKey);
        if (backendPrefs && Array.isArray(backendPrefs) && backendPrefs.length > 0) {
          setFilters(backendPrefs);

          // Update localStorage with authoritative data
          if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(backendPrefs));
          }
        }
      } catch (error) {
        // Silently handle errors - backend endpoint may not exist yet
        // Filters will use defaults or localStorage values
      }

      hasLoadedRef.current = true;
    };

    loadPreferences();
  }, [preferenceKey, storageKey]);

  // Debounced save to backend and localStorage
  const savePreferences = useCallback(
    async (prefs: FacetedFilterConfig<TData>[]) => {
      if (!preferenceKey || !hasLoadedRef.current) return;

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Save to localStorage immediately (fast cache)
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(prefs));
        } catch (error) {
          console.error("Failed to save to localStorage:", error);
        }
      }

      // Debounce backend save (wait 500ms after last change)
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await upsertFilterPreferences(preferenceKey, prefs);
          // Silently handle errors - backend endpoint may not exist yet
          // Preferences are still saved in localStorage
        } catch (error) {
          // Error is already handled in upsertFilterPreferences
          // Continue working with localStorage even if backend fails
        }
      }, 500);
    },
    [preferenceKey, storageKey]
  );

  // Save whenever filters change
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    savePreferences(filters);
  }, [filters, savePreferences]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    filters,
    setFilters,
  };
}

