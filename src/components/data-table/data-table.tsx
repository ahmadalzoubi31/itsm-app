"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataTablePropsExtended } from "@/lib/types/globals";
import type {
  DataTableConfig,
  FacetedFilterConfig,
  FilterGroup,
  FilterBookmark,
} from "./types";
import { useTableColumnPreferences } from "./useTableColumnPreferences";
import { applyAdvancedFilter } from "./filter-utils";
import { useMemo } from "react";

interface DataTableExtendedProps<TData, TValue, TFunc>
  extends DataTablePropsExtended<TData, TValue, TFunc> {
  config?: DataTableConfig<TData>;
  availableFilters?: FacetedFilterConfig<TData>[];
  onFiltersChange?: (filters: FacetedFilterConfig<TData>[]) => void;
  advancedFilter?: FilterGroup<TData>;
  onAdvancedFilterChange?: (filter: FilterGroup<TData> | undefined) => void;
  bookmarks?: FilterBookmark<TData>[];
  onBookmarkSave?: (
    bookmark: Omit<FilterBookmark<TData>, "id" | "createdAt" | "updatedAt">
  ) => void;
  onBookmarkDelete?: (bookmarkId: string) => void;
  onBookmarkLoad?: (bookmark: FilterBookmark<TData>) => void;
}

export function DataTable<TData, TValue, TFunc>({
  columns,
  data,
  refetch,
  isLoading = false,
  config,
  availableFilters,
  onFiltersChange,
  advancedFilter,
  onAdvancedFilterChange,
  bookmarks,
  onBookmarkSave,
  onBookmarkDelete,
  onBookmarkLoad,
}: DataTableExtendedProps<TData, TValue, TFunc>) {
  const [rowSelection, setRowSelection] = React.useState({});

  // Use user preferences hook (will only persist if preferenceKey is provided)
  const defaultVisibility = config?.defaultColumnVisibility || {};
  const { columnVisibility, setColumnVisibility } = useTableColumnPreferences({
    preferenceKey: config?.preferenceKey,
    defaultVisibility,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Apply advanced filter to data
  const filteredData = useMemo(() => {
    if (advancedFilter) {
      return applyAdvancedFilter(data, advancedFilter);
    }
    return data;
  }, [data, advancedFilter]);

  const enableRowSelection = config?.enableRowSelection !== false;
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const loadingRowCount = config?.loadingRowCount || 10;
  const loadingColumnCount = config?.loadingColumnCount || 8;
  const emptyMessage = config?.emptyMessage || "No results found.";

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[250px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[80px]" />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: loadingColumnCount }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: loadingRowCount }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: loadingColumnCount }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-2">
          <Skeleton className="h-4 w-[100px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-[60px]" />
            <Skeleton className="h-8 w-[80px]" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <DataTableToolbar
        table={table}
        refetch={refetch}
        config={config}
        columns={columns as ColumnDef<TData>[]}
        data={data}
        availableFilters={availableFilters}
        onFiltersChange={onFiltersChange}
        advancedFilter={advancedFilter}
        onAdvancedFilterChange={onAdvancedFilterChange}
        bookmarks={bookmarks}
        onBookmarkSave={onBookmarkSave}
        onBookmarkDelete={onBookmarkDelete}
        onBookmarkLoad={onBookmarkLoad}
      />
      <div className="rounded-md overflow-hidden border">
        <Table className="w-full text-sm leading-8">
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
