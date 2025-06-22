"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ROLES } from "../constants/role.constant";
import { STATUSES } from "../constants/status.constant";

import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { statuses } from "../../incidents/constant/statuses";

interface DataTableToolbarProps<TData, TFunc> {
  table: Table<TData>;
  refetch: () => Promise<TFunc>;
}

export function DataTableToolbar<TData, TFunc>({
  table,
  refetch,
}: DataTableToolbarProps<TData, TFunc>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter users..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={ROLES.map((role) => ({
              label: role.label,
              value: role.value,
            }))}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={STATUSES.map((status) => ({
              label: status.label,
              value: status.value,
            }))}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} refetch={refetch} />
    </div>
  );
}
