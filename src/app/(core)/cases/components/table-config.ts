import type { DataTableConfig } from "@/components/data-table";
import { Case } from "../types";

export const tableConfig: DataTableConfig<Case> = {
  emptyMessage: "No cases found.",
  preferenceKey: "cases-table-columns",
  defaultColumnVisibility: {
    number: true,
    title: true,
    status: true,
    priority: true,
    assignee: true,
    requester: true,
    createdAt: true,
    updatedAt: false,
    description: true,
    createdByName: false,
    updatedByName: false,
    businessLine: false,
    affectedService: false,
    slaTimers: false,
    assignmentGroup: true,
  },
  searchFilter: {
    columnKey: "title",
    placeholder: "Filter cases...",
  },
  facetedFilters: [
    {
      columnKey: "status",
      title: "Status",
      options: [
        { label: "New", value: "New" },
        { label: "Waiting Approval", value: "WaitingApproval" },
        { label: "In Progress", value: "InProgress" },
        { label: "Pending", value: "Pending" },
        { label: "Resolved", value: "Resolved" },
        { label: "Closed", value: "Closed" },
      ],
    },
    {
      columnKey: "priority",
      title: "Priority",
      options: [
        { label: "Low", value: "Low" },
        { label: "Medium", value: "Medium" },
        { label: "High", value: "High" },
        { label: "Critical", value: "Critical" },
      ],
    },
  ],
  loadingRowCount: 10,
  loadingColumnCount: 8,
  enableRowSelection: true,
};
