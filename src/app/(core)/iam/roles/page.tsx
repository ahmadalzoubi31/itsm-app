// app/(core)/iam/roles/page.tsx

import { listRolesServer } from "./_lib/_services/role.server";
import RolesPageClient from "./_components/roles-page-client";

export default async function RolesPage() {
  const roles = await listRolesServer();

  return <RolesPageClient initialRoles={roles} />;
}
