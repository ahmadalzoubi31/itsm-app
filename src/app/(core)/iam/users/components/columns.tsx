"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/data-table";
import { DataTableRowActions } from "./data-table-row-actions";

import { User } from "../interfaces/user.interface";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row, getValue }) => (
      <div
        style={{
          // Since rows are flattened by default,
          // we can use the row.depth property
          // and paddingLeft to visually indicate the depth
          // of the row
          paddingLeft: `${row.depth * 2}rem`,
        }}
        className="flex items-center justify-center mx-3"
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select user ${row.original.username}`}
        />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "displayName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Display Name" />
    ),
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className="flex items-center gap-2">
          <span
            className="text-primary hover:text-primary/80 font-medium cursor-pointer"
            onClick={() => {
              router.push(`/iam/users/edit/${row.original.id}`);
            }}
          >
            {row.original.displayName}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className="flex items-center gap-2">
          <span
            className="text-primary hover:text-primary/80 font-medium cursor-pointer"
            onClick={() => {
              router.push(`/iam/users/edit/${row.original.id}`);
            }}
          >
            {row.original.username}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.original.email || "-"}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "authSource",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auth Source" />
    ),
    cell: ({ row }) => {
      const authSource = row.original.authSource;
      const labels: Record<string, string> = {
        local: "Local",
        ldap: "LDAP",
      };
      return (
        <Badge variant="secondary" className="px-1.5">
          {labels[authSource] || authSource}
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return row.original.isActive ? (
        <Badge
          variant="secondary"
          className="text-green-600 px-1.5 bg-green-200"
        >
          Active
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-red-600 px-1.5 bg-red-200">
          Inactive
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const isActive = row.getValue(id) as boolean;
      return value.includes(String(isActive));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "externalId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="External ID" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-xs">
        {row.original.externalId || "-"}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdByName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.original.createdByName || "-"}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "updatedByName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.original.updatedByName || "-"}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {new Date(row.original.updatedAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

export default columns;
