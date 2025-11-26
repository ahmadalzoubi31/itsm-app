"use client";

import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table";
import { DataTableRowActions } from "@/app/(core)/iam/users/_components/data-table/data-table-row-actions";
import type { User } from "@/app/(core)/iam/users/_lib/_types";
import { Mail, User as UserIcon } from "lucide-react";

const AuthSourceLabel: Record<string, string> = {
  local: "Local",
  ldap: "LDAP",
};

function DisplayNameCell({ user }: { user: User }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
        onClick={() => router.push(`/iam/users/${user.id}/edit`)}
      >
        {user.displayName}
      </button>
    </div>
  );
}

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
    cell: ({ row }) => (
      <div
        className="flex items-center justify-center mx-3"
        style={{ paddingLeft: `${row.depth * 2}rem` }}
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select user ${row.original.username}`}
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
    accessorKey: "displayName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Display Name" />
    ),
    cell: ({ row }) => <DisplayNameCell user={row.original} />,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-mono text-sm">{row.original.username}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.original.email;
      return email ? (
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm">{email}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm italic">No email</span>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "roles",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Roles" />
    ),
    cell: ({ row }) => {
      const roles = row.original.roles ?? [];

      if (roles.length === 0) {
        return (
          <span className="text-muted-foreground text-sm italic">No roles</span>
        );
      }

      const getRoleStyle = (roleName: string) => {
        const name = roleName.toLowerCase();

        if (name.includes("admin")) {
          return {
            variant: "default" as const,
            className:
              "bg-red-100 text-red-700 border-red-300 hover:bg-red-200",
          };
        }

        if (name.includes("agent")) {
          return {
            variant: "default" as const,
            className:
              "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200",
          };
        }

        if (name.includes("end_user") || name.includes("requester")) {
          return {
            variant: "default" as const,
            className:
              "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200",
          };
        }

        return {
          variant: "secondary" as const,
          className:
            "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        };
      };

      const MAX_VISIBLE_ROLES = 3;
      const visibleRoles = roles.slice(0, MAX_VISIBLE_ROLES);
      const remainingCount = roles.length - MAX_VISIBLE_ROLES;

      return (
        <div className="flex flex-wrap gap-1.5">
          {visibleRoles.map((role) => {
            const style = getRoleStyle(role.name);
            return (
              <Badge
                key={role.id}
                variant={style.variant}
                className={`px-2 py-0.5 text-xs font-medium ${style.className}`}
              >
                {role.name}
              </Badge>
            );
          })}
          {remainingCount > 0 && (
            <Badge
              variant="secondary"
              className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 border-slate-300"
              title={roles
                .slice(MAX_VISIBLE_ROLES)
                .map((r) => r.name)
                .join(", ")}
            >
              +{remainingCount} more
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "authSource",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auth Source" />
    ),
    cell: ({ row }) => {
      const authSource = row.original.authSource;
      const isLocal = authSource === "local";

      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {AuthSourceLabel[authSource] || authSource}
          </Badge>
        </div>
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
      const isActive = row.original.isActive;
      return (
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <Badge
                variant="default"
                className="bg-green-100 text-green-700 border-green-300 px-2 py-0.5 text-xs font-medium"
              >
                Active
              </Badge>
            </>
          ) : (
            <>
              <Badge
                variant="default"
                className="bg-red-100 text-red-700 border-red-300 px-2 py-0.5 text-xs font-medium"
              >
                Inactive
              </Badge>
            </>
          )}
        </div>
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
    cell: ({ row }) => {
      const externalId = row.original.externalId;
      return externalId ? (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">{externalId}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm italic">-</span>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "createdByName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => {
      const createdBy = row.original.createdByName;
      return (
        <div className="flex items-center gap-2">
          <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            {createdBy || "System"}
          </span>
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
    cell: ({ row }) => (
      <div className="">
        {new Date(row.original.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "updatedByName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => {
      const updatedBy = row.original.updatedByName;
      return (
        <div className="flex items-center gap-2">
          <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            {updatedBy || "System"}
          </span>
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
    cell: ({ row }) => (
      <div className="">
        {new Date(row.original.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];

export default columns;
