"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/data-table";
import { DataTableRowActions } from "./data-table-row-actions";

import { RequestCard } from "@/app/(core)/catalog/admin/request-cards/_lib/_types";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";

export const columns: ColumnDef<RequestCard>[] = [
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
          aria-label={`Select request card ${row.original.name}`}
        />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className="flex items-center gap-2">
          <span
            className="text-primary hover:text-primary/80 font-medium cursor-pointer"
            onClick={() => {
              router.push(
                `/catalog/admin/request-cards/${row.original.id}/edit`
              );
            }}
          >
            {row.original.name}
          </span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        {row.original.key ? row.original.key : "-"}
      </Badge>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.active ? (
            <Badge variant="default" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              Inactive
            </Badge>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const active = row.getValue(id) as boolean;
      return value.includes(String(active));
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "businessLineId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business Line ID" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.businessLineId ? (
          <Badge variant="secondary">{row.original.businessLineId}</Badge>
        ) : (
          "-"
        )}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "workflowId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Workflow ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.original.workflowId ? row.original.workflowId : "-"}
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
        <div className="">
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "-"}
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
        <div className="">
          {row.original.updatedAt
            ? new Date(row.original.updatedAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "-"}
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
        <div className="">
          {row.original.updatedAt
            ? new Date(row.original.updatedAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "-"}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "fields",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fields" />
    ),
    cell: ({ row }) => {
      const fieldCount = Object.keys(
        row.original.jsonSchema?.properties || {}
      ).length;
      return <div className="text-muted-foreground">{fieldCount} fields</div>;
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
