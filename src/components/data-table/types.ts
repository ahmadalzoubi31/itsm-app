import { ColumnDef, VisibilityState } from "@tanstack/react-table";

/**
 * Configuration for faceted filters in the toolbar
 */
export interface FacetedFilterConfig<TData> {
  columnKey: keyof TData | string;
  title: string;
  options: Array<{ label: string; value: string }>;
}

/**
 * Configuration for the search filter in the toolbar
 */
export interface SearchFilterConfig<TData> {
  columnKey: keyof TData | string;
  placeholder: string;
}

/**
 * Complete DataTable configuration
 */
export interface DataTableConfig<TData> {
  /**
   * Message to display when table is empty
   */
  emptyMessage?: string;

  /**
   * Default column visibility state
   */
  defaultColumnVisibility?: VisibilityState;

  /**
   * Configuration for the search filter
   */
  searchFilter?: SearchFilterConfig<TData>;

  /**
   * Configuration for faceted filters
   */
  facetedFilters?: FacetedFilterConfig<TData>[];

  /**
   * Number of skeleton rows to show during loading (default: 10)
   */
  loadingRowCount?: number;

  /**
   * Number of skeleton columns to show during loading (default: 8)
   */
  loadingColumnCount?: number;

  /**
   * Enable row selection (default: true)
   */
  enableRowSelection?: boolean;
}
