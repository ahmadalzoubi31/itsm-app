// utils/fetchWithAuth.ts
export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  try {
    const res = await fetch(input, {
      credentials: "include",
      ...init,
    });

    if (res.status === 401) {
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/auth/sign-in";
      }
      return res;
    }
    return res;
  } catch (error) {
    console.error("Error in fetchWithAuth:", error);
    throw error;
  }
}
