"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/data-table";
import { DataTableRowActions } from "./data-table-row-actions";

import { Case, CaseStatus } from "../types";
import Link from "next/link";
import { CaseStatusBadge } from "./CaseStatusBadge";
import { SLATimers } from "./SLATimer";
import { format } from "date-fns";

export const columns: ColumnDef<Case>[] = [
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
      <div className="flex items-center justify-center mx-3">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select ticket ${row.original.number}`}
        />
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Link href={`/cases/${row.original.id}`} className="text-primary hover:text-primary/80 font-medium">
            {row.original.number}
          </Link>
          {row.original.slaTimers?.some(
            (timer) =>
              timer.status === "Breached" ||
              (timer.status === "Running" && timer.remainingMs < 0)
          ) && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <div>{row.original.title}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 max-w-md">
          <span className="line-clamp-2 text-sm text-muted-foreground">
            {row.original.description || "-"}
          </span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col text-sm">
        <p>{row.original.category?.name || "—"}</p>
        <p className="text-sm text-muted-foreground">
          {row.original.subcategory?.name || "—"}
        </p>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return <CaseStatusBadge status={row.original.status as CaseStatus} />;
    },
    filterFn: (row, id, value) => {
      const status = row.getValue(id) as string;
      return value.includes(status);
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.original.priority;
      return (
        <Badge
          variant={
            priority === "Critical" || priority === "High"
              ? "destructive"
              : "secondary"
          }
        >
          {priority}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const priority = row.getValue(id) as string;
      return value.includes(priority);
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "requester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Requester" />
    ),
    cell: ({ row }) => {
      const requester = row.original.requester;
      return (
        <div className="text-sm">
          {requester
            ? requester.displayName ||
              `${requester.firstName || ""} ${
                requester.lastName || ""
              }`.trim() ||
              requester.email ||
              "-"
            : "-"}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "assignee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignee" />
    ),
    cell: ({ row }) => {
      const assignee = row.original.assignee;
      return (
        <div className="text-sm">
          {assignee
            ? assignee.displayName ||
              `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim() ||
              assignee.email ||
              "-"
            : "-"}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: "assignmentGroup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignment Group" />
    ),
    cell: ({ row }) => {
      const group = row.original.assignmentGroup;
      return <Badge variant="outline">{group ? group.name : "-"}</Badge>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "businessLine",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business Line" />
    ),
    cell: ({ row }) => {
      const businessLine = row.original.businessLine;
      return (
        <div className="text-sm">{businessLine ? businessLine.name : "-"}</div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "affectedService",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Affected Service" />
    ),
    cell: ({ row }) => {
      const service = row.original.affectedService;
      return <div className="text-sm">{service ? service.name : "-"}</div>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "slaTimers",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SLA Timers" />
    ),
    cell: ({ row }) => {
      const timers = row.original.slaTimers;
      return (
        <div>
          {timers && timers.length > 0 ? (
            <SLATimers timers={timers} maxDisplay={2} />
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground text-sm">
          {format(new Date(row.original.createdAt), "PP")}
        </div>
      );
    },
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
        <div className="text-muted-foreground text-sm">
          {row.original.createdByName || "-"}
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
        <div className="text-muted-foreground text-sm">
          {format(new Date(row.original.updatedAt), "PP")}
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
        <div className="text-muted-foreground text-sm">
          {row.original.updatedByName || "-"}
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
