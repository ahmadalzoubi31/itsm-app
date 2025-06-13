"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { statuses } from "../constant/statuses";
import { priorities } from "../constant/priorities";
import { Incident } from "../validation/schema";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconAlertCircleFilled,
  IconLoader,
} from "@tabler/icons-react";
import { Users, User } from "lucide-react";

export const columns: ColumnDef<Incident>[] = [
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
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select ticket ${row.original.number}`}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Incident Number" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span className="text-primary hover:text-primary/80 font-medium">
            {row.original.number}
          </span>
          {row.original.slaBreachTime &&
            row.original.slaBreachTime < new Date() && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <div>{row.original.title}</div>,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <p>{row.original.category}</p>
        <p className="text-sm text-muted-foreground">
          {row.original.subcategory}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status") as string
      );

      if (!status) {
        return null;
      }

      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {status.value === "resolved" || status.value === "closed" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : status.value === "cancelled" ? (
            <IconCircleXFilled className="fill-red-500 dark:fill-red-400" />
          ) : status.value === "on_hold" ? (
            <IconAlertCircleFilled className="fill-yellow-500 dark:fill-yellow-400" />
          ) : status.value === "assigned" ? (
            <IconLoader />
          ) : (
            <IconLoader />
          )}
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      );

      if (!priority) {
        return null;
      }

      return (
        <Badge variant="outline" className={`${priority.color} px-2`}>
          {priority.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "assignmentGroup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignment Group" />
    ),
    cell: ({ row }) => {
      const isAssigned = row.original.assignmentGroup !== "";

      if (isAssigned) {
        return (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-muted-foreground font-medium">
              {row.original.assignmentGroup}
            </span>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned To" />
    ),
    cell: ({ row }) => {
      const isAssigned = row.original.assignedTo !== "";

      if (isAssigned) {
        return (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-4 w-4" />
            </div>
            <span className="text-muted-foreground font-medium">
              {row.original.assignedTo}
            </span>
          </div>
        );
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

export default columns;
