// src/app/(core)/iam/users/_components/table-config.ts

import type { DataTableConfig } from "@/components/data-table";
import { Service } from "@/app/(core)/catalog/admin/services/_lib/_types/service.type";

export const tableConfig: DataTableConfig<Service> = {
  emptyMessage: "No services found.",

  defaultColumnVisibility: {
    id: false,
    name: true,
    key: true,
    businessLine: true,
    description: true,
  },

  preferenceKey: "services-table-columns",

  searchFilter: {
    columnKey: "name",
    placeholder: "Filter services...",
  },

  loadingRowCount: 30,
  loadingColumnCount: 8,
  enableRowSelection: true,
} as const;
