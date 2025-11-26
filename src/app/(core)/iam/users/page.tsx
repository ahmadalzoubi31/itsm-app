import { listUsersServer } from "./_lib/_services/user.server";
import UsersPageClient from "./_components/users-page-client";

export default async function UsersPage() {
  const users = await listUsersServer();
  return <UsersPageClient initialUsers={users} />;
}
