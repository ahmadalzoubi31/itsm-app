"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table";
import { RequestStatusBadge } from "../RequestStatusBadge";
import { Eye, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import type { Request } from "../../_lib/_types/request.type";
import { Checkbox } from "@/components/ui/checkbox";

function RequestTitleCell({ request }: { request: Request }) {
  return (
    <div className="space-y-1">
      <div className="font-medium line-clamp-1">{request.title}</div>
      {/* <div className="text-sm text-muted-foreground line-clamp-1">
        {request.description || "No description"}
      </div> */}
    </div>
  );
}

export const columns: ColumnDef<Request>[] = [
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
        className="flex items-center justify-center mx-3"
        style={{ paddingLeft: `${row.depth * 2}rem` }}
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select user ${row.original.id}`}
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
    cell: ({ row }) => <div className="flex space-x-2">{row.original.id}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Request Name" />
    ),
    cell: ({ row }) => <RequestTitleCell request={row.original} />,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.original.description}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.type}
      </Badge>
    ),
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
      const isHighPriority = priority === "Critical" || priority === "High";
      return (
        <Badge
          variant={isHighPriority ? "destructive" : "secondary"}
          className="text-xs"
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          {priority}
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <RequestStatusBadge status={row.original.status} />,
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
      return businessLine ? (
        <Badge variant="secondary" className="text-xs">
          {businessLine.name}
        </Badge>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDistanceToNow(new Date(row.original.createdAt), {
          addSuffix: true,
        })}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const request = row.original;
      return (
        <div className="text-right">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/requests/${request.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Link>
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export default columns;
