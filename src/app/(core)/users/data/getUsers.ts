import { fetchWithAuth } from "@/utils/fetxhWithAuth";
import { getBackendUrl } from "@/utils/getBackendUrl";

export async function getUsers() {
  const res = await fetchWithAuth(getBackendUrl("/api/users"), {
    credentials: "include", // Send cookies (for auth)
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
