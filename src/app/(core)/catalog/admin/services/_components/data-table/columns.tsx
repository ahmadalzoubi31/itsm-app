"use client";

import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table";
import { DataTableRowActions } from "@/app/(core)/catalog/admin/services/_components/data-table/data-table-row-actions";
import { Service } from "@/app/(core)/catalog/admin/services/_lib/_types/service.type";
import { Badge } from "@/components/ui/badge";

function DisplayNameCell({ service }: { service: Service }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
        onClick={() =>
          router.push(`/catalog/admin/services/${service.id}/edit`)
        }
      >
        {service.name}
      </button>
    </div>
  );
}

export const columns: ColumnDef<Service>[] = [
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
          aria-label={`Select service ${row.original.name}`}
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <DisplayNameCell service={row.original} />,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className="text-sm font-mono">
        <span className="font-mono text-sm">{row.original.key}</span>
      </Badge>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "businessLine",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Business Line" />
    ),
    cell: ({ row }) => {
      const businessLineId = row.original.businessLineId;

      return (
        <div className="flex items-center gap-2">
          <span className="text-sm">{businessLineId || "-"}</span>
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
      return <span className="text-sm">{row.original.description}</span>;
    },
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
