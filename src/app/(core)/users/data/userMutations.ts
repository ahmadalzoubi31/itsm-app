import { AddUserInput, EditUserInput, User } from "./types";
import { getBackendUrl } from "@/utils/getBackendUrl";

export async function addUser(userData: AddUserInput): Promise<User> {
  const res = await fetch(getBackendUrl("/api/users"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Failed to add user");
  return res.json();
}

export async function editUser(id: string, userData: EditUserInput) {
  return fetch(getBackendUrl(`/api/users/${id}`), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to edit user");
    return res.json();
  });
}

export async function deleteUser(id: string) {
  return fetch(getBackendUrl(`/api/users/${id}`), {
    method: "DELETE",
    credentials: "include",
  }).then((res) => res.json());
}
