// utils/fetchWithAuth.ts
export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, {
    credentials: "include",
    ...init,
  });

  if (res.status === 401) {
    // Redirect to login page
    if (typeof window !== "undefined") {
      window.location.href = "/auth/sign-in";
    }
    // Optionally throw or handle error
    throw new Error("Unauthorized");
  }
  return res;
}
