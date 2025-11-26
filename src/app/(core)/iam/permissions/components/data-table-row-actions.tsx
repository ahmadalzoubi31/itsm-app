"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Permission } from "../interfaces/permission.interface";
import type { DataTableRowActionsProps } from "@/lib/types/globals";

export function DataTableRowActions({
  row,
}: DataTableRowActionsProps<Permission>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* Permissions are predefined system entities and cannot be edited or deleted */}
        <DropdownMenuItem disabled>View Details</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
