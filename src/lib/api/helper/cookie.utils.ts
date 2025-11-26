/**
 * Cookie utility functions for client-side cookie access
 */

/**
 * Get a cookie value by name from the browser
 * @param name - Cookie name to retrieve
 * @returns Cookie value or null if not found or in SSR context
 */
export function getCookieValue(name: string): string | null {
  if (typeof window === "undefined") return null;

  const nameEq = `${name}=`;
  const cookies = window.document.cookie.split(";");

  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(nameEq)) {
      return trimmed.substring(nameEq.length);
    }
  }

  return null;
}
