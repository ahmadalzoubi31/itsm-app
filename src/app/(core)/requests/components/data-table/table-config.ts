import type { DataTableConfig } from "@/components/data-table";
import type { Request } from "../../_lib/_types/request.type";
import {
  RequestStatus,
  RequestPriority,
  RequestType,
} from "../../_lib/_types/request.type";

export const tableConfig: DataTableConfig<Request> = {
  emptyMessage: "No requests found.",

  defaultColumnVisibility: {
    id: false,
    title: true,
    description: false,
    type: true,
    priority: true,
    status: true,
    businessLine: true,
    createdAt: true,
  },

  preferenceKey: "requests-table-columns",

  searchFilter: {
    columnKey: "title",
    placeholder: "Filter requests...",
  },

  facetedFilters: [
    {
      columnKey: "status",
      title: "Status",
      options: [
        { label: "Submitted", value: RequestStatus.SUBMITTED },
        { label: "Waiting Approval", value: RequestStatus.WAITING_APPROVAL },
        { label: "Assigned", value: RequestStatus.ASSIGNED },
        { label: "In Progress", value: RequestStatus.IN_PROGRESS },
        { label: "Resolved", value: RequestStatus.RESOLVED },
        { label: "Closed", value: RequestStatus.CLOSED },
      ] as const,
    },
    {
      columnKey: "priority",
      title: "Priority",
      options: [
        { label: "Low", value: RequestPriority.LOW },
        { label: "Medium", value: RequestPriority.MEDIUM },
        { label: "High", value: RequestPriority.HIGH },
        { label: "Critical", value: RequestPriority.CRITICAL },
      ] as const,
    },
    {
      columnKey: "type",
      title: "Type",
      options: [
        { label: "Service Request", value: RequestType.SERVICE_REQUEST },
        { label: "Incident", value: RequestType.INCIDENT },
      ] as const,
    },
  ],

  loadingRowCount: 10,
  loadingColumnCount: 7,
  enableRowSelection: false,
} as const;
