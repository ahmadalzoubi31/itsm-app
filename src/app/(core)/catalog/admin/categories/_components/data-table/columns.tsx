// src/app/(core)/catalog/admin/categories/_lib/_components/data-table/columns.tsx

"use client";

import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

import type { CatalogCategory } from "@/app/(core)/catalog/admin/categories/_lib/_types";
import { CategoryRowActions } from "./row-actions";

export const columns: ColumnDef<CatalogCategory>[] = [
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
    cell: ({ row }) => (
      <div
        className="mx-3 flex items-center justify-center"
        style={{ paddingLeft: `${row.depth * 2}rem` }}
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select category ${row.original.name}`}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="flex max-w-[180px] items-center space-x-2 truncate text-xs text-muted-foreground">
        {row.original.id}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const router = useRouter();

      return (
        <button
          type="button"
          className="cursor-pointer font-medium text-primary hover:text-primary/80"
          onClick={() =>
            router.push(`/catalog/admin/categories/${row.original.id}/edit`)
          }
        >
          {row.original.name}
        </button>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="font-mono text-xs text-muted-foreground"
      >
        {row.original.key}
      </Badge>
    ),
    enableSorting: true,
  },

  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description;

      return <span>{description || "-"}</span>;
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isActive = row.original.active;

      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={isActive ? "bg-emerald-500/10 text-emerald-600" : ""}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "createdByName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {row.original.createdByName ?? "—"}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {new Date(row.original.updatedAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "updatedByName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {row.original.updatedByName ?? "—"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoryRowActions row={row} />,
  },
];
