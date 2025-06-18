import { AddUserInput, EditUserInput, User } from "./types";

export async function addUser(userData: AddUserInput): Promise<User> {
  const res = await fetch("http://localhost:3000/users", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Failed to add user");
  return res.json();
}

export async function editUser(id: string, userData: EditUserInput) {
  return fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  }).then((res) => res.json());
}

export async function deleteUser(id: string) {
  return fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  }).then((res) => res.json());
}
