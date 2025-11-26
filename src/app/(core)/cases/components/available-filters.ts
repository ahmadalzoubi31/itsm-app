import type { FacetedFilterConfig } from "@/components/data-table";
import { Case } from "../types";
import {
  CASE_STATUS_OPTIONS,
  CASE_PRIORITY_OPTIONS,
} from "../types";

/**
 * All available filter configurations for cases
 * Users can select which ones to display
 */
export const AVAILABLE_CASE_FILTERS: FacetedFilterConfig<Case>[] = [
  {
    columnKey: "status",
    title: "Status",
    options: CASE_STATUS_OPTIONS.map((opt) => ({
      label: opt.label,
      value: opt.value,
    })),
  },
  {
    columnKey: "priority",
    title: "Priority",
    options: CASE_PRIORITY_OPTIONS.map((opt) => ({
      label: opt.label,
      value: opt.value,
    })),
  },
  // Add more filters here as needed
  // Example:
  // {
  //   columnKey: "assignee",
  //   title: "Assignee",
  //   options: [], // Would need to be populated dynamically
  // },
];

