"use client";

import { DataTable } from "@/components/data-table";
import { columns } from "./data-table/columns";
import { tableConfig } from "./data-table/table-config";
import type { Request } from "../_lib/_types/request.type";

interface RequestTableViewProps {
  requests: Request[];
}

export function RequestTableView({ requests }: RequestTableViewProps) {
  return (
    <DataTable
      data={requests}
      columns={columns}
      isLoading={false}
      config={tableConfig}
      refetch={async () => {}}
    />
  );
}
