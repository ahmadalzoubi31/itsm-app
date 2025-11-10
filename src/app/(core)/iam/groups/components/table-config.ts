import type { DataTableConfig } from "@/components/data-table";
import type { Group } from "../interfaces/group.interface";

export const tableConfig: DataTableConfig<Group> = {
  emptyMessage: "No groups found.",
  defaultColumnVisibility: {
    id: false,
    type: true,
    name: true,
    description: true,
    businessLine: true,
    createdAt: true,
    createdByName: false,
    updatedAt: false,
    updatedByName: false,
  },
  searchFilter: {
    columnKey: "name",
    placeholder: "Filter groups...",
  },
  loadingRowCount: 10,
  loadingColumnCount: 5,
  enableRowSelection: true,
};
