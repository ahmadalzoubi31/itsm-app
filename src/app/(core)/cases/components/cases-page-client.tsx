"use client";

import { useMemo, useState } from "react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import {
  DataTable,
  useTableFilterPreferences,
  useFilterBookmarks,
  type DataTableConfig,
  type FilterGroup,
} from "@/components/data-table";
import { tableConfig } from "./table-config";
import { Case } from "../types";

interface CasesPageClientProps {
  initialCases: Case[];
}

const CasesPageClient = ({ initialCases }: CasesPageClientProps) => {
  // HOOKS
  // Custom Hooks
  const { filters, setFilters } = useTableFilterPreferences<Case>({
    preferenceKey: tableConfig.preferenceKey
      ? `${tableConfig.preferenceKey}-filters`
      : undefined,
    defaultFilters: tableConfig.facetedFilters || [],
  });

  const { bookmarks, saveBookmark, deleteBookmark } = useFilterBookmarks<Case>({
    preferenceKey: tableConfig.preferenceKey
      ? `${tableConfig.preferenceKey}-filters`
      : undefined,
  });

  // React Hooks
  const [advancedFilter, setAdvancedFilter] = useState<
    FilterGroup<Case> | undefined
  >();

  // EFFECTS

  // HELPERS

  // EVENT HANDLERS
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleBookmarkLoad = (bookmark: (typeof bookmarks)[0]) => {
    setAdvancedFilter(bookmark.filter);
  };

  // EARLY RETURNS

  // RENDER LOGIC
  const dynamicTableConfig = useMemo<DataTableConfig<Case>>(
    () => ({
      ...tableConfig,
      facetedFilters: filters,
    }),
    [filters]
  );

  return (
    <>
      <div className="flex flex-row items-center justify-between px-4 lg:px-8">
        <div className="text-2xl font-bold tracking-tight">
          Cases
          <div className="text-muted-foreground text-sm font-normal">
            Manage and track all cases
          </div>
        </div>
        <Button size="sm" asChild>
          <Link
            href="/cases/new"
            className="dark:text-foreground flex items-center gap-2"
          >
            <PlusIcon className="size-4" />
            New Case
          </Link>
        </Button>
      </div>
      <div className="px-4 lg:px-8">
        <DataTable
          data={initialCases}
          columns={columns}
          isLoading={false}
          config={dynamicTableConfig}
          availableFilters={tableConfig.facetedFilters}
          onFiltersChange={handleFiltersChange}
          advancedFilter={advancedFilter}
          onAdvancedFilterChange={setAdvancedFilter}
          bookmarks={bookmarks}
          onBookmarkSave={saveBookmark}
          onBookmarkDelete={deleteBookmark}
          onBookmarkLoad={handleBookmarkLoad}
          refetch={async () => {
            return Promise.resolve();
          }}
        />
      </div>
    </>
  );
};

export default CasesPageClient;
