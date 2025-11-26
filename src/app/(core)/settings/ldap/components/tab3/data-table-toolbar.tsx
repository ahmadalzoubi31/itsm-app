"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { STAGED_USER_STATUSES } from "../../constants/staged-user-status.constant";

import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

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
        {/* Filter by full name(cn) and username(sAMAccountName) */}
        <Input
          placeholder="Filter staged users..."
          value={
            (table.getColumn("cn")?.getFilterValue() as string) ??
            // (table.getColumn("sAMAccountName")?.getFilterValue() as string) ??
            ""
          }
          onChange={
            (event) => table.getColumn("cn")?.setFilterValue(event.target.value)
            //  ||
            // table
            //   .getColumn("sAMAccountName")
            //   ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={STAGED_USER_STATUSES.map((status) => ({
              label: status.label,
              value: status.value,
            }))}
          />
        )}
        {isFiltered && (
          <Button
            size="sm"
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
