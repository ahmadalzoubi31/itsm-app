import type { DataTableConfig } from "@/components/data-table";
import { RequestCard } from "@/app/(core)/catalog/admin/request-cards/_lib/_types";

export const tableConfig: DataTableConfig<RequestCard> = {
  emptyMessage: "No request cards found.",
  defaultColumnVisibility: {
    name: true,
    key: true,
    businessLineId: true,
    active: true,
    fields: true,
    createdAt: false,
    updatedAt: false,
    createdByName: false,
    updatedByName: false,
    workflowId: false,
  },
  searchFilter: {
    columnKey: "key",
    placeholder: "Filter request cards...",
  },
  facetedFilters: [
    {
      columnKey: "active",
      title: "Active",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
  ],
  loadingRowCount: 10,
  loadingColumnCount: 8,
  enableRowSelection: true,
};
