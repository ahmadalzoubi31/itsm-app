// utils/fetchWithAuth.ts

interface ErrorResponse {
  message: string;
  method: string;
  path: string;
  statusCode: number;
  timestamp: string;
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  try {
    const res = await fetch(input, {
      credentials: "include", // ✅ CRITICAL: Enable cookies
      ...init,
    });

    const data = await res.json();

    // Handle error response
    if (typeof data === "object" && "message" in data && "statusCode" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    console.error("Error in fetchWithAuth:", error);
    throw error;
  }
}
