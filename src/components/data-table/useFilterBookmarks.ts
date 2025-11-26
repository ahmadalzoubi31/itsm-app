"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getFilterBookmarks,
  saveFilterBookmark,
  deleteFilterBookmark as deleteBookmarkApi,
} from "@/lib/services/user-preferences.service";
import type { FilterBookmark } from "./types";

const STORAGE_PREFIX = "table-filter-bookmarks-";

interface UseFilterBookmarksOptions<TData> {
  preferenceKey?: string;
  defaultBookmarks?: FilterBookmark<TData>[];
}

export function useFilterBookmarks<TData>({
  preferenceKey,
  defaultBookmarks = [],
}: UseFilterBookmarksOptions<TData>) {
  const storageKey = preferenceKey ? `${STORAGE_PREFIX}${preferenceKey}` : null;

  const [bookmarks, setBookmarks] = useState<FilterBookmark<TData>[]>(defaultBookmarks);
  const hasLoadedRef = useRef(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load bookmarks from localStorage first, then backend
  useEffect(() => {
    if (typeof window === "undefined" || !preferenceKey || hasLoadedRef.current) return;

    const loadBookmarks = async () => {
      // 1. Try localStorage first
      try {
        if (storageKey) {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const parsed = JSON.parse(saved) as FilterBookmark<TData>[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              setBookmarks(parsed);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load bookmarks from localStorage:", error);
      }

      // 2. Then fetch from backend
      try {
        const backendBookmarks = await getFilterBookmarks<TData>(preferenceKey);
        if (backendBookmarks && Array.isArray(backendBookmarks)) {
          setBookmarks(backendBookmarks);
          if (storageKey && backendBookmarks.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(backendBookmarks));
          }
        }
      } catch (error) {
        // Silently handle errors
      }

      hasLoadedRef.current = true;
    };

    loadBookmarks();
  }, [preferenceKey, storageKey]);

  // Save bookmark
  const saveBookmark = useCallback(
    async (bookmark: Omit<FilterBookmark<TData>, "id" | "createdAt" | "updatedAt">) => {
      if (!preferenceKey) return;

      const newBookmark: FilterBookmark<TData> = {
        ...bookmark,
        id: `bookmark-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedBookmarks = [...bookmarks, newBookmark];
      setBookmarks(updatedBookmarks);

      // Save to localStorage immediately
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(updatedBookmarks));
        } catch (error) {
          console.error("Failed to save to localStorage:", error);
        }
      }

      // Save to backend
      try {
        await saveFilterBookmark(preferenceKey, bookmark);
      } catch (error) {
        // Error already handled in service
      }
    },
    [preferenceKey, bookmarks, storageKey]
  );

  // Delete bookmark
  const deleteBookmark = useCallback(
    async (bookmarkId: string) => {
      if (!preferenceKey) return;

      const updatedBookmarks = bookmarks.filter((b) => b.id !== bookmarkId);
      setBookmarks(updatedBookmarks);

      // Update localStorage
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(updatedBookmarks));
        } catch (error) {
          console.error("Failed to save to localStorage:", error);
        }
      }

      // Delete from backend
      try {
        await deleteBookmarkApi(preferenceKey, bookmarkId);
      } catch (error) {
        // Error already handled in service
      }
    },
    [preferenceKey, bookmarks, storageKey]
  );

  return {
    bookmarks,
    saveBookmark,
    deleteBookmark,
  };
}

