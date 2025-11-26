import type { DataTableConfig } from "@/components/data-table/types";

export const tableConfig: DataTableConfig = {
  columnVisibility: {
    id: false,
    createdAt: false,
    createdByName: false,
    updatedAt: false,
    updatedByName: false,
  },
  enableRowSelection: true,
  enableColumnVisibility: true,
  enablePagination: true,
  enableSearch: true,
  searchColumn: "name",
  searchPlaceholder: "Search subcategories...",
};
