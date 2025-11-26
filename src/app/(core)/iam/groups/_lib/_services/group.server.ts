// src/app/(core)/iam/groups/lib/services/groups.server.ts

import { fetchWithAuth } from "@/lib/api/helper/fetchWithAuth";
import { getBackendUrl } from "@/lib/api/helper/getBackendUrl";
import { GROUPS_ENDPOINTS } from "@/lib/api/endpoints/groups";

export async function listGroupsServer() {
    return fetchWithAuth(getBackendUrl(GROUPS_ENDPOINTS.base));
}
