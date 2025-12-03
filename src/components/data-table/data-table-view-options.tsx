"use client";

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { DataTableViewOptionsProps } from "@/lib/types/globals";

export function DataTableViewOptions<TData, TFunc>({
  table,
  refetch,
}: DataTableViewOptionsProps<TData, TFunc>) {
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="ml-auto mr-2 hidden h-8 lg:flex"
        onClick={() => refetch?.()}
      >
        Refresh
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto hidden h-8 lg:flex"
          >
            <Settings2 />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[170px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
