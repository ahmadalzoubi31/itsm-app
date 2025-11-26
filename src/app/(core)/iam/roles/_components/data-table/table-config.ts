import type { DataTableConfig } from "@/components/data-table";
import type { Role } from "@/app/(core)/iam/roles/_lib/_types/role.type";

export const tableConfig: DataTableConfig<Role> = {
  emptyMessage: "No roles found.",
  defaultColumnVisibility: {
    id: false,
    name: true,
    subject: true,
    description: true,
    permissionCount: true,
    userCount: true,
    createdAt: true,
    createdByName: false,
    updatedAt: false,
    updatedByName: false,
  },
  searchFilter: {
    columnKey: "name",
    placeholder: "Filter roles...",
  },
  loadingRowCount: 10,
  loadingColumnCount: 5,
  enableRowSelection: true,
};
