import type { DataTableConfig } from "@/components/data-table";
import { Group } from "../../_lib/_types/group.type";

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

  preferenceKey: "groups-table-column",

  searchFilter: {
    columnKey: "name",
    placeholder: "Filter groups...",
  },

  facetedFilters: [
    {
      columnKey: "type",
      title: "Type",
      options: [
        {
          label: "Helpdesk",
          value: "help-desk",
        },
        {
          label: "Tier 1",
          value: "tier-1",
        },
        {
          label: "Tier 2",
          value: "tier-2",
        },
        {
          label: "Tier 3",
          value: "tier-3",
        },
      ] as const,
    },
  ],

  loadingRowCount: 10,
  loadingColumnCount: 5,
  enableRowSelection: true,
} as const;
