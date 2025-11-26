// src/app/(core)/iam/users/_components/table-config.ts

import type { DataTableConfig } from "@/components/data-table";
import { AUTH_SOURCE, type User } from "@/app/(core)/iam/users/_lib/_types";

export const tableConfig: DataTableConfig<User> = {
  emptyMessage: "No users found.",

  defaultColumnVisibility: {
    id: false,
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

  preferenceKey: "users-table-columns",

  searchFilter: {
    columnKey: "username",
    placeholder: "Filter users...",
  },

  facetedFilters: [
    {
      columnKey: "authSource",
      title: "Auth Source",
      options: [
        { label: "Local", value: AUTH_SOURCE.LOCAL },
        { label: "LDAP", value: AUTH_SOURCE.LDAP },
      ] as const,
    },
    {
      columnKey: "isActive",
      title: "Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ] as const,
    },
  ],

  loadingRowCount: 30,
  loadingColumnCount: 8,
  enableRowSelection: true,
} as const;
