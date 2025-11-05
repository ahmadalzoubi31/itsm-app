import type { DataTableConfig } from "@/components/data-table";
import { User } from "../interfaces/user.interface";

export const tableConfig: DataTableConfig<User> = {
  emptyMessage: "No users found.",
  defaultColumnVisibility: {
    displayName: true,
    username: true,
    email: true,
    authSource: true,
    isActive: true,
    externalId: false,
    permissions: false,
    createdAt: true,
    createdByName: false,
    updatedAt: false,
    updatedByName: false,
  },
  searchFilter: {
    columnKey: "username",
    placeholder: "Filter users...",
  },
  facetedFilters: [
    {
      columnKey: "authSource",
      title: "Auth Source",
      options: [
        { label: "Local", value: "local" },
        { label: "LDAP", value: "ldap" },
      ],
    },
    {
      columnKey: "isActive",
      title: "Status",
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
