// src/app/(core)/catalog/admin/services/actions.ts

"use server";

import { revalidatePath } from "next/cache";

import {
  serviceSchema,
  type ServiceFormValues,
} from "./_lib/_schemas/service.schema";
import {
  createService,
  getService,
  listServices,
} from "./_lib/_services/service.service";

const SERVICES_PATH = "/catalog/admin/services";

// helpers
function validateServiceOnServer(input: ServiceFormValues) {
  const parsed = serviceSchema.safeParse(input);

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid service data");
  }

  return parsed.data;
}

// actions
export async function upsertServiceAction(input: ServiceFormValues) {
  const valid = validateServiceOnServer(input);

  // backend currently supports only create
  await createService(valid);

  revalidatePath(SERVICES_PATH);
}

export async function getServiceAction(id: string) {
  return await getService(id);
}

export async function listServicesAction() {
  return await listServices();
}
