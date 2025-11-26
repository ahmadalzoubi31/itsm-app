// src/app/(core)/catalog/admin/categories/_lib/_types/category.type.ts

import type { BaseEntity } from "@/lib/types/globals";

export type CatalogCategory = BaseEntity & {
  id: string;
  key: string;
  name: string;
  description?: string;
  active: boolean;
};
