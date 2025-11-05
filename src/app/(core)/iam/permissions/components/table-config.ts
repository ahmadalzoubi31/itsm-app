import type { DataTableConfig } from "@/components/data-table";
import type { Permission } from "../interfaces/permission.interface";

export const tableConfig: DataTableConfig<Permission> = {
  emptyMessage: "No permissions found.",
  defaultColumnVisibility: {
    key: true,
    subject: true,
    action: true,
    description: true,
  },
  searchFilter: {
    columnKey: "key",
    placeholder: "Filter permissions...",
  },
  loadingRowCount: 10,
  loadingColumnCount: 5,
  enableRowSelection: true,
};
