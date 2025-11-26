// src/app/(core)/iam/groups/page.tsx

import { listGroupsServer } from "@/app/(core)/iam/groups/_lib/_services/group.server";
import GroupsPageClient from "@/app/(core)/iam/groups/_components/groups-page-client";

export default async function GroupsPage() {
  const groups = await listGroupsServer();

  return <GroupsPageClient initialGroups={groups} />;
}
