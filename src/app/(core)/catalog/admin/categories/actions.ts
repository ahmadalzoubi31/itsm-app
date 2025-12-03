// src/app/(core)/catalog/admin/categories/actions.ts

"use server";

import { revalidatePath } from "next/cache";

import {
  categorySchema,
  type CategoryFormValues,
} from "@/app/(core)/catalog/admin/categories/_lib/_schemas/category.schema";
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from "@/app/(core)/catalog/admin/categories/_lib/_services/category.service";

const CATEGORIES_PATH = "/catalog/admin/categories";

// helpers
function validateCategory(input: CategoryFormValues) {
  const parsed = categorySchema.safeParse(input);

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid category data");
  }

  return parsed.data;
}

// actions

export async function upsertCategoryAction(input: CategoryFormValues) {
  const valid = validateCategory(input);

  if (valid.id) {
    const { id, ...dto } = valid;
    await updateCategory(id, dto);
  } else {
    await createCategory({
      ...valid,
      businessLineId: "",
    });
  }

  revalidatePath(CATEGORIES_PATH);
}

export async function deleteCategoryAction(id: string) {
  await deleteCategory(id);
  revalidatePath(CATEGORIES_PATH);
}

export async function getCategoryAction(id: string) {
  return await getCategory(id);
}

export async function listCategoriesAction() {
  return await listCategories();
}
