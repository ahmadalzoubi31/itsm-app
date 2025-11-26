// src/app/(core)/catalog/admin/subcategories/_lib/_types/subcategory.type.ts

import type { BaseEntity } from "@/lib/types/globals";

export type CatalogSubcategory = BaseEntity & {
  id: string;
  key: string;
  name: string;
  categoryId: string;
  description?: string;
  active: boolean;
  category?: {
    id: string;
    key: string;
    name: string;
  };
};
