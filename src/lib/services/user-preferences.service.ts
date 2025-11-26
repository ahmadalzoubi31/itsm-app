import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { USER_PREFERENCES_ENDPOINTS } from "@/lib/api/endpoints/user-preferences";
import type { VisibilityState } from "@tanstack/react-table";
import type { FacetedFilterConfig, FilterBookmark } from "@/components/data-table";

/**
 * Get table preference for current user
 */
export async function getTablePreference(
  preferenceKey: string
): Promise<VisibilityState | null> {
  try {
    const response = await fetchWithAuth(
      getBackendUrl(USER_PREFERENCES_ENDPOINTS.table(preferenceKey)),
      {
        method: "GET",
        credentials: "include",
      }
    );

    return response?.preferences || null;
  } catch (error: any) {
    // If 404, return null (no preference saved yet)
    if (error?.statusCode === 404) {
      return null;
    }
    console.error("Failed to fetch table preference:", error);
    throw error;
  }
}

/**
 * Save or update table preference for current user
 */
export async function upsertTablePreference(
  preferenceKey: string,
  preferences: VisibilityState
): Promise<VisibilityState> {
  try {
    const response = await fetchWithAuth(
      getBackendUrl(USER_PREFERENCES_ENDPOINTS.upsertTable),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          preferenceKey,
          preferences,
        }),
      }
    );

    return response?.preferences || preferences;
  } catch (error) {
    console.error("Failed to save table preference:", error);
    throw error;
  }
}

/**
 * Delete table preference for current user
 */
export async function deleteTablePreference(
  preferenceKey: string
): Promise<void> {
  try {
    await fetchWithAuth(
      getBackendUrl(USER_PREFERENCES_ENDPOINTS.deleteTable(preferenceKey)),
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Failed to delete table preference:", error);
    throw error;
  }
}

/**
 * Get filter preferences for current user
 */
export async function getFilterPreferences<TData>(
  preferenceKey: string
): Promise<FacetedFilterConfig<TData>[] | null> {
  try {
    const response = await fetchWithAuth(
      getBackendUrl(USER_PREFERENCES_ENDPOINTS.filters(preferenceKey)),
      {
        method: "GET",
        credentials: "include",
      }
    );

    return response?.filters || null;
  } catch (error: any) {
    // If 404, return null (no preference saved yet - endpoint may not exist)
    if (error?.statusCode === 404) {
      return null;
    }
    // Silently handle 404s, only log other errors
    if (error?.statusCode !== 404) {
      console.error("Failed to fetch filter preferences:", error);
    }
    // Return null for any error (graceful degradation)
    return null;
  }
}

/**
 * Save or update filter preferences for current user
 */
export async function upsertFilterPreferences<TData>(
  preferenceKey: string,
  filters: FacetedFilterConfig<TData>[]
): Promise<FacetedFilterConfig<TData>[]> {
  try {
    const response = await fetchWithAuth(
      getBackendUrl(USER_PREFERENCES_ENDPOINTS.upsertFilters),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          preferenceKey,
          filters,
        }),
      }
    );

    return response?.filters || filters;
  } catch (error: any) {
    // If 404 or endpoint doesn't exist, just return the filters (graceful degradation)
    // Preferences will still be saved in localStorage
    if (error?.statusCode === 404) {
      return filters;
    }
    // Only log non-404 errors
    if (error?.statusCode !== 404) {
      console.error("Failed to save filter preferences:", error);
    }
    // Return filters even on error (localStorage will still have them)
    return filters;
  }
}

/**
 * Delete filter preferences for current user
 */
export async function deleteFilterPreferences(
  preferenceKey: string
): Promise<void> {
  try {
    await fetchWithAuth(
      getBackendUrl(USER_PREFERENCES_ENDPOINTS.deleteFilters(preferenceKey)),
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  } catch (error) {
    console.error("Failed to delete filter preferences:", error);
    throw error;
  }
}

/**
 * Get filter bookmarks for current user
 */
export async function getFilterBookmarks<TData>(
  preferenceKey: string
): Promise<FilterBookmark<TData>[] | null> {
  try {
    const response = await fetchWithAuth(
      getBackendUrl(`${USER_PREFERENCES_ENDPOINTS.filters(preferenceKey)}/bookmarks`),
      {
        method: "GET",
        credentials: "include",
      }
    );

    return response?.bookmarks || null;
  } catch (error: any) {
    // 404 is expected if endpoint doesn't exist yet - return empty array
    if (error?.statusCode === 404) {
      return [];
    }
    // Silently handle other errors
    return [];
  }
}

/**
 * Save filter bookmark for current user
 */
export async function saveFilterBookmark<TData>(
  preferenceKey: string,
  bookmark: Omit<FilterBookmark<TData>, "id" | "createdAt" | "updatedAt">
): Promise<FilterBookmark<TData>> {
  try {
    const response = await fetchWithAuth(
      getBackendUrl(`${USER_PREFERENCES_ENDPOINTS.upsertFilters}/bookmarks`),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          preferenceKey,
          bookmark,
        }),
      }
    );

    return response?.bookmark || {
      ...bookmark,
      id: `bookmark-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as FilterBookmark<TData>;
  } catch (error: any) {
    // 404 is expected if endpoint doesn't exist yet - return bookmark with generated ID
    // This allows bookmarks to work with localStorage even if backend isn't ready
    return {
      ...bookmark,
      id: `bookmark-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as FilterBookmark<TData>;
  }
}

/**
 * Delete filter bookmark for current user
 */
export async function deleteFilterBookmark(
  preferenceKey: string,
  bookmarkId: string
): Promise<void> {
  try {
    await fetchWithAuth(
      getBackendUrl(`${USER_PREFERENCES_ENDPOINTS.filters(preferenceKey)}/bookmarks/${bookmarkId}`),
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  } catch (error: any) {
    if (error?.statusCode !== 404) {
      console.error("Failed to delete filter bookmark:", error);
    }
  }
}
