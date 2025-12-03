"use client";

import { useState } from "react";
import { Plus, X, Bookmark, BookmarkCheck, Trash2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FilterOperator,
  type FilterCondition,
  type FilterGroup,
  type FilterBookmark,
} from "./types";

interface DataTableAdvancedFilterProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  activeFilter?: FilterGroup<TData>;
  onFilterChange: (filter: FilterGroup<TData> | undefined) => void;
  bookmarks?: FilterBookmark<TData>[];
  onBookmarkSave?: (
    bookmark: Omit<FilterBookmark<TData>, "id" | "createdAt" | "updatedAt">
  ) => void;
  onBookmarkDelete?: (bookmarkId: string) => void;
  onBookmarkLoad?: (bookmark: FilterBookmark<TData>) => void;
}

// Operator options based on field type
const getOperatorsForField = (
  fieldType: "text" | "number" | "date" | "boolean" | "array"
) => {
  const textOperators = [
    { value: FilterOperator.EQUALS, label: "is" },
    { value: FilterOperator.NOT_EQUALS, label: "is not" },
    { value: FilterOperator.CONTAINS, label: "contains" },
    { value: FilterOperator.NOT_CONTAINS, label: "does not contain" },
    { value: FilterOperator.STARTS_WITH, label: "starts with" },
    { value: FilterOperator.ENDS_WITH, label: "ends with" },
    { value: FilterOperator.IS_EMPTY, label: "is empty" },
    { value: FilterOperator.IS_NOT_EMPTY, label: "is not empty" },
  ];

  const numberOperators = [
    { value: FilterOperator.EQUALS, label: "equals" },
    { value: FilterOperator.NOT_EQUALS, label: "not equals" },
    { value: FilterOperator.GREATER_THAN, label: "greater than" },
    { value: FilterOperator.LESS_THAN, label: "less than" },
    {
      value: FilterOperator.GREATER_THAN_OR_EQUAL,
      label: "greater than or equal",
    },
    { value: FilterOperator.LESS_THAN_OR_EQUAL, label: "less than or equal" },
    { value: FilterOperator.BETWEEN, label: "between" },
  ];

  const dateOperators = [
    { value: FilterOperator.EQUALS, label: "is" },
    { value: FilterOperator.NOT_EQUALS, label: "is not" },
    { value: FilterOperator.GREATER_THAN, label: "after" },
    { value: FilterOperator.LESS_THAN, label: "before" },
    { value: FilterOperator.BETWEEN, label: "between" },
  ];

  switch (fieldType) {
    case "text":
      return textOperators;
    case "number":
      return numberOperators;
    case "date":
      return dateOperators;
    case "boolean":
      return [
        { value: FilterOperator.EQUALS, label: "is" },
        { value: FilterOperator.NOT_EQUALS, label: "is not" },
      ];
    case "array":
      return [
        { value: FilterOperator.IN, label: "is one of" },
        { value: FilterOperator.NOT_IN, label: "is not one of" },
        { value: FilterOperator.IS_EMPTY, label: "is empty" },
        { value: FilterOperator.IS_NOT_EMPTY, label: "is not empty" },
      ];
    default:
      return textOperators;
  }
};

// Detect field type from data
const detectFieldType = (
  data: any[],
  field: string
): "text" | "number" | "date" | "boolean" | "array" => {
  if (data.length === 0) return "text";

  const sample = data[0];
  const value = (sample as any)[field];

  if (value === null || value === undefined) return "text";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (Array.isArray(value)) return "array";
  if (
    value instanceof Date ||
    (typeof value === "string" && !isNaN(Date.parse(value)))
  )
    return "date";
  return "text";
};

export function DataTableAdvancedFilter<TData>({
  columns,
  data,
  activeFilter,
  onFilterChange,
  bookmarks = [],
  onBookmarkSave,
  onBookmarkDelete,
  onBookmarkLoad,
}: DataTableAdvancedFilterProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterGroup, setFilterGroup] = useState<FilterGroup<TData>>(
    activeFilter || {
      id: "root",
      conditions: [],
      logic: "AND",
    }
  );
  const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
  const [bookmarkName, setBookmarkName] = useState("");
  const [bookmarkDescription, setBookmarkDescription] = useState("");

  // Helper to get column title
  const getColumnTitle = (col: ColumnDef<TData>): string => {
    if (typeof col.header === "string") return col.header;
    const key = (col.id as string) || "";
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Get filterable columns
  const filterableColumns = columns.filter((col) => {
    const key = (col.id as string) || "";
    return key && key !== "select" && key !== "actions";
  });

  // Add new condition
  const addCondition = () => {
    const newCondition: FilterCondition<TData> = {
      id: `condition-${Date.now()}`,
      field: (filterableColumns[0]?.id as string) || "",
      operator: FilterOperator.EQUALS,
      value: "",
    };
    setFilterGroup({
      ...filterGroup,
      conditions: [...filterGroup.conditions, newCondition],
    });
  };

  // Update condition
  const updateCondition = (
    id: string,
    updates: Partial<FilterCondition<TData>>
  ) => {
    setFilterGroup({
      ...filterGroup,
      conditions: filterGroup.conditions.map((cond) =>
        cond.id === id ? { ...cond, ...updates } : cond
      ),
    });
  };

  // Remove condition
  const removeCondition = (id: string) => {
    setFilterGroup({
      ...filterGroup,
      conditions: filterGroup.conditions.filter((cond) => cond.id !== id),
    });
  };

  // Apply filter
  const applyFilter = () => {
    if (filterGroup.conditions.length === 0) {
      onFilterChange(undefined);
    } else {
      onFilterChange(filterGroup);
    }
    setIsOpen(false);
  };

  // Clear filter
  const clearFilter = () => {
    setFilterGroup({
      id: "root",
      conditions: [],
      logic: "AND",
    });
    onFilterChange(undefined);
  };

  // Save bookmark
  const saveBookmark = () => {
    if (!bookmarkName.trim() || !onBookmarkSave) return;

    onBookmarkSave({
      name: bookmarkName,
      description: bookmarkDescription,
      filter: filterGroup,
      isDefault: false,
    });

    setBookmarkName("");
    setBookmarkDescription("");
    setBookmarkDialogOpen(false);
  };

  // Load bookmark
  const loadBookmark = (bookmark: FilterBookmark<TData>) => {
    setFilterGroup(bookmark.filter);
    if (onBookmarkLoad) {
      onBookmarkLoad(bookmark);
    }
  };

  // Get field type for a condition
  const getFieldType = (field: string) => {
    return detectFieldType(data, field);
  };

  // Check if operator needs value input
  const needsValue = (operator: FilterOperator) => {
    return ![FilterOperator.IS_EMPTY, FilterOperator.IS_NOT_EMPTY].includes(
      operator
    );
  };

  // Check if operator needs second value (BETWEEN)
  const needsSecondValue = (operator: FilterOperator) => {
    return operator === FilterOperator.BETWEEN;
  };

  const activeConditionsCount = filterGroup.conditions.length;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="h-8">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filter
            {activeConditionsCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeConditionsCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Advanced Filter</DialogTitle>
            <DialogDescription>
              Build complex filters with multiple conditions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Logic Selector */}
            <div className="flex items-center gap-2">
              <Label>Match</Label>
              <Select
                value={filterGroup.logic}
                onValueChange={(value: "AND" | "OR") =>
                  setFilterGroup({ ...filterGroup, logic: value })
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">All conditions</SelectItem>
                  <SelectItem value="OR">Any condition</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditions */}
            <div className="space-y-2">
              {filterGroup.conditions.length === 0 ? (
                <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No conditions. Click "Add Condition" to get started.
                </div>
              ) : (
                filterGroup.conditions.map((condition, index) => {
                  const fieldType = getFieldType(condition.field as string);
                  const operators = getOperatorsForField(fieldType);

                  return (
                    <div
                      key={condition.id}
                      className="flex items-start gap-2 rounded-md border p-3"
                    >
                      {index > 0 && (
                        <div className="flex items-center pt-2">
                          <Badge variant="outline" className="text-xs">
                            {filterGroup.logic}
                          </Badge>
                        </div>
                      )}

                      <div className="flex-1 grid grid-cols-12 gap-2">
                        {/* Field */}
                        <Select
                          value={condition.field as string}
                          onValueChange={(value) =>
                            updateCondition(condition.id, {
                              field: value,
                              operator: FilterOperator.EQUALS,
                              value: "",
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Field" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterableColumns.map((col) => {
                              const key = (col.id as string) || "";
                              return (
                                <SelectItem key={key} value={key}>
                                  {getColumnTitle(col)}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        {/* Operator */}
                        <Select
                          value={condition.operator}
                          onValueChange={(value: FilterOperator) =>
                            updateCondition(condition.id, { operator: value })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {operators.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Value */}
                        {needsValue(condition.operator) && (
                          <>
                            <Input
                              type={
                                fieldType === "number"
                                  ? "number"
                                  : fieldType === "date"
                                  ? "date"
                                  : "text"
                              }
                              className="col-span-3"
                              placeholder="Value"
                              value={condition.value || ""}
                              onChange={(e) =>
                                updateCondition(condition.id, {
                                  value: e.target.value,
                                })
                              }
                            />
                            {needsSecondValue(condition.operator) && (
                              <Input
                                type={
                                  fieldType === "number"
                                    ? "number"
                                    : fieldType === "date"
                                    ? "date"
                                    : "text"
                                }
                                className="col-span-3"
                                placeholder="Value 2"
                                value={condition.value2 || ""}
                                onChange={(e) =>
                                  updateCondition(condition.id, {
                                    value2: e.target.value,
                                  })
                                }
                              />
                            )}
                          </>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => removeCondition(condition.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Condition Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={addCondition}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Condition
            </Button>

            <Separator />

            {/* Bookmarks */}
            {bookmarks.length > 0 && (
              <div className="space-y-2">
                <Label>Saved Filters</Label>
                <div className="flex flex-wrap gap-2">
                  {bookmarks.map((bookmark) => (
                    <Badge
                      key={bookmark.id}
                      variant="secondary"
                      className="cursor-pointer gap-1"
                      onClick={() => loadBookmark(bookmark)}
                    >
                      <BookmarkCheck className="h-3 w-3" />
                      {bookmark.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2">
                {onBookmarkSave && (
                  <Dialog
                    open={bookmarkDialogOpen}
                    onOpenChange={setBookmarkDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Save Filter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Filter</DialogTitle>
                        <DialogDescription>
                          Save this filter as a bookmark for quick access
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="bookmark-name">Name</Label>
                          <Input
                            id="bookmark-name"
                            value={bookmarkName}
                            onChange={(e) => setBookmarkName(e.target.value)}
                            placeholder="My Filter"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bookmark-desc">
                            Description (optional)
                          </Label>
                          <Textarea
                            id="bookmark-desc"
                            value={bookmarkDescription}
                            onChange={(e) =>
                              setBookmarkDescription(e.target.value)
                            }
                            placeholder="Description of this filter"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setBookmarkDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={saveBookmark}
                          disabled={!bookmarkName.trim()}
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="outline" size="sm" onClick={clearFilter}>
                  Clear
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={applyFilter}>Apply Filter</Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
