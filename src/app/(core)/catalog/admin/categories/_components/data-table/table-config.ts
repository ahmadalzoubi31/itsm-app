// src/app/(core)/catalog/admin/categories/_lib/_components/data-table/table-config.ts

import type { DataTableConfig } from "@/components/data-table";
import type { CatalogCategory } from "@/app/(core)/catalog/admin/categories/_lib/_types";

export const tableConfig: DataTableConfig<CatalogCategory> = {
  emptyMessage: "No categories found.",
  defaultColumnVisibility: {
    id: false,
    key: true,
    name: true,
    parentName: true,
    businessLine: true,
    isActive: true,
    createdAt: true,
    createdByName: false,
    updatedAt: false,
    updatedByName: false,
  },
  searchFilter: {
    columnKey: "name",
    placeholder: "Filter categories...",
  },
  loadingRowCount: 10,
  loadingColumnCount: 7,
  enableRowSelection: true,
} as const;
