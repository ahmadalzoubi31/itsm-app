"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Info } from "lucide-react";
import {
  ConditionalLogic,
  Condition,
  ConditionOperator,
} from "@/app/(core)/catalog/admin/request-cards/_lib/_utils/conditionEvaluator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SchemaField {
  key: string;
  title: string;
  type: string;
  enum?: string[];
}

interface ConditionBuilderProps {
  value?: ConditionalLogic;
  onChange: (value: ConditionalLogic | undefined) => void;
  availableFields: SchemaField[];
  currentFieldKey?: string;
}

const ConditionBuilder = ({
  value,
  onChange,
  availableFields,
  currentFieldKey,
}: ConditionBuilderProps) => {
  // HOOKS
  const [conditions, setConditions] = useState<Condition[]>(
    value?.conditions || []
  );
  const [logicOperator, setLogicOperator] = useState<"AND" | "OR">(
    value?.logicOperator || "AND"
  );

  // EFFECTS
  useEffect(() => {
    if (conditions.length === 0) {
      onChange(undefined);
    } else {
      onChange({
        conditions,
        logicOperator,
      });
    }
  }, [conditions, logicOperator]);

  // EVENT HANDLERS
  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        field: "",
        operator: "equals",
        value: "",
      },
    ]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    setConditions(
      conditions.map((condition, i) =>
        i === index ? { ...condition, ...updates } : condition
      )
    );
  };

  // HELPERS
  const getOperatorLabel = (operator: ConditionOperator): string => {
    const labels: Record<ConditionOperator, string> = {
      equals: "Equals",
      notEquals: "Not Equals",
      contains: "Contains",
      isEmpty: "Is Empty",
      isNotEmpty: "Is Not Empty",
    };
    return labels[operator];
  };

  const needsValueInput = (operator: ConditionOperator): boolean => {
    return operator !== "isEmpty" && operator !== "isNotEmpty";
  };

  const getFieldByKey = (key: string): SchemaField | undefined => {
    return availableFields.find((f) => f.key === key);
  };

  // Filter out the current field to prevent self-reference
  const selectableFields = availableFields.filter(
    (f) => f.key !== currentFieldKey
  );

  // RENDER LOGIC
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Conditional Logic</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addCondition}
          disabled={selectableFields.length === 0}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Condition
        </Button>
      </div>

      {selectableFields.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Fields Available</AlertTitle>
          <AlertDescription>
            Add other fields first before creating conditional logic.
          </AlertDescription>
        </Alert>
      )}

      {conditions.length > 0 && (
        <>
          <div className="space-y-3">
            {conditions.map((condition, index) => {
              const selectedField = getFieldByKey(condition.field);
              const showValueInput = needsValueInput(condition.operator);

              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Condition {index + 1}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCondition(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        {/* Field Selection */}
                        <div className="space-y-2">
                          <Label className="text-xs">Field</Label>
                          <Select
                            value={condition.field}
                            onValueChange={(value) =>
                              updateCondition(index, { field: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectableFields.map((field) => (
                                <SelectItem key={field.key} value={field.key}>
                                  {field.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Operator Selection */}
                        <div className="space-y-2">
                          <Label className="text-xs">Operator</Label>
                          <Select
                            value={condition.operator}
                            onValueChange={(value: ConditionOperator) =>
                              updateCondition(index, {
                                operator: value,
                                // Clear value if switching to isEmpty/isNotEmpty
                                value: needsValueInput(value)
                                  ? condition.value
                                  : undefined,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="notEquals">
                                Not Equals
                              </SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="isEmpty">Is Empty</SelectItem>
                              <SelectItem value="isNotEmpty">
                                Is Not Empty
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Value Input */}
                        {showValueInput && (
                          <div className="space-y-2">
                            <Label className="text-xs">Value</Label>
                            {selectedField?.enum ? (
                              <Select
                                value={condition.value?.toString() || ""}
                                onValueChange={(value) =>
                                  updateCondition(index, { value })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedField.enum.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                type={
                                  selectedField?.type === "number"
                                    ? "number"
                                    : "text"
                                }
                                value={condition.value?.toString() || ""}
                                onChange={(e) =>
                                  updateCondition(index, {
                                    value:
                                      selectedField?.type === "number"
                                        ? parseFloat(e.target.value)
                                        : e.target.value,
                                  })
                                }
                                placeholder="Enter value"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Logic Operator Selection */}
          {conditions.length > 1 && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Label className="text-sm">Show field when:</Label>
              <Select
                value={logicOperator}
                onValueChange={(value: "AND" | "OR") => setLogicOperator(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND">All conditions match</SelectItem>
                  <SelectItem value="OR">Any condition matches</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Help Text */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This field will only be visible when the{" "}
              {conditions.length > 1
                ? logicOperator === "AND"
                  ? "all conditions are"
                  : "any condition is"
                : "condition is"}{" "}
              met. Hidden fields will have their values cleared and validation
              skipped.
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
};

export default ConditionBuilder;
