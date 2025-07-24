"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { GROUP_TYPES, GroupTypeEnum } from "../constants/group-type.constant";
import {
  GROUP_STATUSES,
  GroupStatusEnum,
} from "../constants/group-status.constant";

import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { GroupMembersDialog } from "./GroupMembersDialog";

import { Group } from "../types";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Group>[] = [
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
          paddingLeft: `${row.depth * 2}rem`,
        }}
        className="flex items-center justify-center mx-3"
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select group ${row.original.name}`}
        />
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Group Name" />
    ),
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className="flex items-center gap-2">
          <span
            className="text-primary hover:text-primary/80 font-medium cursor-pointer"
            onClick={() => {
              router.push(`/groups/edit/${row.original.id}`);
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
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <div className="max-w-[200px] truncate" title={description}>
          {description || "No description"}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = GROUP_TYPES.find(
        (type) => type.value === (row.getValue("type") as string)
      );

      if (!type) {
        return null;
      }

      const getTypeColor = (typeValue: GroupTypeEnum) => {
        switch (typeValue) {
          case GroupTypeEnum.SUPPORT:
            return "text-blue-600 bg-blue-200";
          case GroupTypeEnum.TECHNICAL:
            return "text-purple-600 bg-purple-200";
          case GroupTypeEnum.MANAGEMENT:
            return "text-green-600 bg-green-200";
          case GroupTypeEnum.ESCALATION:
            return "text-red-600 bg-red-200";
          case GroupTypeEnum.SPECIALIST:
            return "text-orange-600 bg-orange-200";
          default:
            return "text-gray-600 bg-gray-200";
        }
      };

      return (
        <Badge
          variant="secondary"
          className={`px-1.5 ${getTypeColor(type.value)}`}
        >
          {type.label}
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = GROUP_STATUSES.find(
        (status: { value: string }) =>
          status.value === (row.getValue("status") as string)
      );

      if (!status) {
        return null;
      }

      const getStatusColor = (statusValue: GroupStatusEnum) => {
        switch (statusValue) {
          case GroupStatusEnum.ACTIVE:
            return "text-green-600 bg-green-200";
          case GroupStatusEnum.INACTIVE:
            return "text-red-600 bg-red-200";
          case GroupStatusEnum.PENDING:
            return "text-yellow-600 bg-yellow-200";
          case GroupStatusEnum.SUSPENDED:
            return "text-orange-600 bg-orange-200";
          case GroupStatusEnum.ARCHIVED:
            return "text-gray-600 bg-gray-200";
          default:
            return "text-gray-600 bg-gray-200";
        }
      };

      return (
        <Badge
          variant="secondary"
          className={`px-1.5 ${getStatusColor(
            status.value as GroupStatusEnum
          )}`}
        >
          {status.label}
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "leader",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Team Leader" />
    ),
    cell: ({ row }) => {
      const leader = row.original.leader;
      return (
        <div className="text-muted-foreground">
          {leader?.fullName || "No leader assigned"}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "members",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Members" />
    ),
    cell: ({ row }) => {
      const memberCount = row.original.members.length;
      const group = row.original;

      return (
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground">
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </div>
          <GroupMembersDialog
            group={group}
            trigger={
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Users className="h-3 w-3" />
              </Button>
            }
          />
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
    cell: ({ row }) => <div>{row.original.email || "No email"}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div>{row.original.phone || "No phone"}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => <div>{row.original.location || "No location"}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.original.createdBy.username}
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
    accessorKey: "updatedBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.original.updatedBy.username}
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
