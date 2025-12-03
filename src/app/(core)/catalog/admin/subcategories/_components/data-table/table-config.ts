import type { DataTableConfig } from "@/components/data-table";
import type { CatalogSubcategory } from "@/app/(core)/catalog/admin/subcategories/_lib/_types";

export const tableConfig: DataTableConfig<CatalogSubcategory> = {
  emptyMessage: "No subcategories found.",
  defaultColumnVisibility: {
    id: false,
    key: true,
    name: true,
    categoryId: true,
    category: true,
  },
  searchFilter: {
    columnKey: "name",
    placeholder: "Filter subcategories...",
  },
  loadingRowCount: 10,
  loadingColumnCount: 7,
  enableRowSelection: true,
};
