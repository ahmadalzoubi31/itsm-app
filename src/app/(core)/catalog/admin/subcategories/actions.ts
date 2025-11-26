// src/app/(core)/catalog/admin/subcategories/actions.ts

"use server";

import { revalidatePath } from "next/cache";

import {
  subcategorySchema,
  type SubcategoryFormValues,
} from "@/app/(core)/catalog/admin/subcategories/_lib/_schemas/subcategory.schema";
import {
  createSubcategory,
  deleteSubcategory,
  getSubcategory,
  listSubcategories,
  updateSubcategory,
} from "@/app/(core)/catalog/admin/subcategories/_lib/_services/subcategory.service";

const SUBCATEGORIES_PATH = "/catalog/admin/subcategories";

// helpers
function validateSubcategory(input: SubcategoryFormValues) {
  const parsed = subcategorySchema.safeParse(input);

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid subcategory data");
  }

  return parsed.data;
}

// actions

export async function upsertSubcategoryAction(input: SubcategoryFormValues) {
  const valid = validateSubcategory(input);

  if (valid.id) {
    const { id, key, ...dto } = valid;
    await updateSubcategory(id, dto);
  } else {
    const { key, name, categoryId, description } = valid;
    await createSubcategory({ key, name, categoryId, description });
  }

  revalidatePath(SUBCATEGORIES_PATH);
}

export async function deleteSubcategoryAction(id: string) {
  await deleteSubcategory(id);
  revalidatePath(SUBCATEGORIES_PATH);
}

export async function getSubcategoryAction(id: string) {
  return await getSubcategory(id);
}

export async function listSubcategoriesAction(categoryId?: string) {
  return await listSubcategories(categoryId);
}
