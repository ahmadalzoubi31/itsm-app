"use client";

import { RequestCard } from "@/app/(core)/catalog/admin/request-cards/_lib/_types";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { tableConfig } from "./table-config";

interface RequestCardTableProps {
  requestCards: RequestCard[];
}

const RequestCardTable = ({ requestCards }: RequestCardTableProps) => {
  // HOOKS
  // Custom Hooks
  // React Hooks

  // EFFECTS
  // useEffect(() => {}, []);

  // HELPERS
  // const helperFn = () => {};

  // EVENT HANDLERS
  // const handleClick = () => {};

  // EARLY RETURNS
  if (requestCards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No request cards found. Create your first request card to get started.
      </div>
    );
  }

  // RENDER LOGIC
  return (
    <DataTable
      data={requestCards}
      columns={columns}
      isLoading={false}
      config={tableConfig}
      refetch={async () => {
        return Promise.resolve();
      }}
    />
  );
};

export default RequestCardTable;
