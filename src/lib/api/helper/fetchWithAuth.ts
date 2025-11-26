// utils/fetchWithAuth.ts

interface ErrorResponse {
  message: string;
  method?: string;
  path?: string;
  statusCode: number;
  timestamp?: string;
  errors?: any[];
}

export class ApiError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(message: string, statusCode: number, errors?: any[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const headers = new Headers(init?.headers);

  // ------------------------------------------------------------------
  // ❗ Server-Side Cookie Forwarding
  // ------------------------------------------------------------------
  // When running in a Server Action or Server Component, fetch() does NOT
  // automatically forward the incoming request's cookies to the external API.
  // We must manually retrieve them using `next/headers` and attach them.
  // ------------------------------------------------------------------
  if (typeof window === "undefined") {
    try {
      // Dynamically import to avoid "server-only" errors in Client Components
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      if (allCookies.length > 0) {
        const cookieString = allCookies
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");
        headers.set("Cookie", cookieString);
        headers.set("Content-Type", "application/json");
      }
    } catch (error) {
      // Ignore errors (e.g. if called outside of request context)
      // console.warn("Failed to attach server cookies:", error);
    }
  }

  try {
    const res = await fetch(input, {
      credentials: "include", // ✅ CRITICAL: Enable cookies (for client side)
      ...init,
      headers,
    });

    const contentType = res.headers.get("content-type");
    const text = await res.text();

    let data;

    // For 404s, don't try to parse JSON - just throw a silent error
    if (res.status === 404) {
      throw new ApiError("Not found", 404);
    }

    // For 401s, throw a silent error
    // if (res.status === 401) {
    //   throw new ApiError("Unauthorized", 401);
    // }

    try {
      data = JSON.parse(text);
    } catch (e) {
      // If response is not JSON, use text as message
      // Don't log for 404s (already handled above)
      if (res.status !== 404) {
        console.error("Non-JSON response:", text);
      }
      return new ApiError(
        `Request failed with status ${res.status}: ${text}`,
        res.status
      );
    }

    // Handle error response
    if (
      !res.ok ||
      (typeof data === "object" && "message" in data && "statusCode" in data)
    ) {
      const errorResponse = data as ErrorResponse;
      const statusCode = errorResponse.statusCode || res.status;

      // Don't log 404 errors - they're often expected (e.g., checking if resource exists)
      if (statusCode !== 404) {
        // Log the full error response for debugging
        console.error("API Error Response:", {
          status: res.status,
          statusText: res.statusText,
          contentType,
          data: errorResponse,
          fullResponse: JSON.stringify(errorResponse, null, 2),
        });
      }

      // NestJS BadRequestException might nest errors differently
      // Try multiple possible locations for errors array
      const errors =
        errorResponse.errors ||
        (errorResponse as any).error?.errors ||
        (errorResponse as any).error ||
        (typeof (errorResponse as any).error === "object"
          ? [(errorResponse as any).error]
          : undefined);

      throw new ApiError(
        errorResponse.message || "Request failed",
        statusCode,
        Array.isArray(errors) ? errors : errors ? [errors] : undefined
      );
    }

    return data;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }

    console.error("Error in fetchWithAuth:", error);
    throw error;
  }
}
