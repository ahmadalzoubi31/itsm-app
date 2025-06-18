import { fetchWithAuth } from "@/utils/fetxhWithAuth";

export async function getUsers() {
  const res = await fetchWithAuth("http://localhost:3000/api/users", {
    credentials: "include", // Send cookies (for auth)
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}
