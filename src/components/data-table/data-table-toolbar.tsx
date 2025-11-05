"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import type { DataTableToolbarProps } from "@/types/globals";
import type { DataTableConfig } from "./types";

export function DataTableToolbar<TData>({
  table,
  refetch,
  config,
}: DataTableToolbarProps<TData> & {
  config?: DataTableConfig<TData>;
}) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const searchFilter = config?.searchFilter;
  const facetedFilters = config?.facetedFilters || [];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchFilter && (
          <Input
            placeholder={searchFilter.placeholder}
            value={
              (table
                .getColumn(searchFilter.columnKey as string)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(searchFilter.columnKey as string)
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {facetedFilters.map((filterConfig) => {
          const column = table.getColumn(filterConfig.columnKey as string);
          if (!column) return null;

          return (
            <DataTableFacetedFilter
              key={filterConfig.columnKey as string}
              column={column}
              title={filterConfig.title}
              options={filterConfig.options}
            />
          );
        })}

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
