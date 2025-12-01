"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calculator, Info, AlertTriangle } from "lucide-react";
import {
  FieldCalculation,
  validateCalculation,
  extractDependencies,
} from "@/app/(core)/catalog/admin/request-cards/_lib/_utils/calculationEvaluator";

interface SchemaField {
  key: string;
  title: string;
  type: string;
}

interface CalculationBuilderProps {
  value?: FieldCalculation;
  onChange: (value: FieldCalculation | undefined) => void;
  availableFields: SchemaField[];
  currentFieldKey?: string;
}

const CalculationBuilder = ({
  value,
  onChange,
  availableFields,
  currentFieldKey,
}: CalculationBuilderProps) => {
  const [expression, setExpression] = useState(value?.expression || "");
  const [error, setError] = useState<string | null>(null);

  // Filter out current field to prevent self-reference
  const validFields = availableFields.filter((f) => f.key !== currentFieldKey);

  useEffect(() => {
    if (!expression.trim()) {
      onChange(undefined);
      setError(null);
      return;
    }

    // Validate expression
    // For now, we only support arithmetic
    const validation = validateCalculation(
      expression,
      validFields.map((f) => f.key)
    );

    if (validation.valid) {
      setError(null);
      const dependencies = extractDependencies(expression);
      onChange({
        type: "arithmetic",
        expression,
        dependencies,
      });
    } else {
      setError(validation.error || "Invalid expression");
      // We don't call onChange with invalid data, or we could pass it with an error flag if needed
      // For now, let's not update the parent if it's invalid, or maybe we should to let them save WIP?
      // Let's only update if valid to prevent broken schemas.
    }
  }, [expression]);

  const insertField = (fieldKey: string) => {
    setExpression((prev) => prev + fieldKey);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Calculation Formula
        </Label>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Enter a mathematical expression using field keys. Example:{" "}
          <code className="bg-muted px-1 rounded">quantity * price</code>
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label className="text-xs">Available Fields (Click to insert)</Label>
        <div className="flex flex-wrap gap-2">
          {validFields.map((field) => (
            <Button
              key={field.key}
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => insertField(field.key)}
            >
              {field.title}{" "}
              <span className="text-muted-foreground ml-1">({field.key})</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expression">Expression</Label>
        <Input
          id="expression"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g. field1 + field2"
          className={error ? "border-destructive" : ""}
        />
        {error && (
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default CalculationBuilder;
