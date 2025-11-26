"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableFilterManager } from "./data-table-filter-manager";
import { DataTableAdvancedFilter } from "./data-table-advanced-filter";
import type { DataTableToolbarProps } from "@/lib/types/globals";
import type { DataTableConfig, FacetedFilterConfig, FilterGroup, FilterBookmark } from "./types";
import type { ColumnDef } from "@tanstack/react-table";

interface DataTableToolbarExtendedProps<TData> extends DataTableToolbarProps<TData> {
  config?: DataTableConfig<TData>;
  columns?: ColumnDef<TData>[];
  data?: TData[];
  availableFilters?: FacetedFilterConfig<TData>[];
  onFiltersChange?: (filters: FacetedFilterConfig<TData>[]) => void;
  advancedFilter?: FilterGroup<TData>;
  onAdvancedFilterChange?: (filter: FilterGroup<TData> | undefined) => void;
  bookmarks?: FilterBookmark<TData>[];
  onBookmarkSave?: (bookmark: Omit<FilterBookmark<TData>, "id" | "createdAt" | "updatedAt">) => void;
  onBookmarkDelete?: (bookmarkId: string) => void;
  onBookmarkLoad?: (bookmark: FilterBookmark<TData>) => void;
}

export function DataTableToolbar<TData>({
  table,
  refetch,
  config,
  columns,
  data,
  availableFilters,
  onFiltersChange,
  advancedFilter,
  onAdvancedFilterChange,
  bookmarks,
  onBookmarkSave,
  onBookmarkDelete,
  onBookmarkLoad,
}: DataTableToolbarExtendedProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const searchFilter = config?.searchFilter;
  const facetedFilters = config?.facetedFilters || [];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2 flex-wrap gap-2">
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

        {/* Active Faceted Filters */}
        {facetedFilters.map((filterConfig) => {
          const columnKey = filterConfig.columnKey as string;
          if (!columnKey) return null;

          const column = table.getColumn(columnKey);
          if (!column) return null;

          return (
            <DataTableFacetedFilter
              key={columnKey}
              column={column}
              title={filterConfig.title}
              options={filterConfig.options}
            />
          );
        })}

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
      <div className="flex items-center gap-2">
        {/* Advanced Filter */}
        {columns && data && onAdvancedFilterChange && (
          <DataTableAdvancedFilter
            columns={columns}
            data={data}
            activeFilter={advancedFilter}
            onFilterChange={onAdvancedFilterChange}
            bookmarks={bookmarks}
            onBookmarkSave={onBookmarkSave}
            onBookmarkDelete={onBookmarkDelete}
            onBookmarkLoad={onBookmarkLoad}
          />
        )}
        {/* Filter Manager Modal */}
        {columns && data && onFiltersChange && (
          <DataTableFilterManager
            columns={columns}
            data={data}
            activeFilters={facetedFilters}
            onFiltersChange={onFiltersChange}
            predefinedFilters={availableFilters}
          />
        )}
        <DataTableViewOptions table={table} refetch={refetch} />
      </div>
    </div>
  );
}
